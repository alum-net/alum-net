package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.messaging.*;
import org.alumnet.application.dtos.requests.UserFilterDTO;
import org.alumnet.application.enums.UserRole;
import org.alumnet.application.mapper.UserMapper;
import org.alumnet.application.query_builders.UserSpecification;
import org.alumnet.domain.messaging.Conversation;
import org.alumnet.domain.messaging.Message;
import org.alumnet.domain.repositories.ConversationRepository;
import org.alumnet.domain.repositories.MessageRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.exceptions.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private static final int MAX_MESSAGE_LENGTH = 2000;
    private static final String CONVERSATIONS_TOPIC_PREFIX = "/topic/conversations/";

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationPermissionService permissionService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserMapper userMapper;

    public Conversation getOrCreateConversation(String currentUserEmail, String otherUserEmail) {
        if (!permissionService.canCommunicate(currentUserEmail, otherUserEmail)) {
            throw new UnauthorizedConversationAccessException(
                    "No puedes iniciar conversación con " + otherUserEmail);
        }

        List<String> sortedParticipants = Arrays.asList(currentUserEmail, otherUserEmail);
        Collections.sort(sortedParticipants);

        Optional<Conversation> existingConversation = conversationRepository.findByParticipants(sortedParticipants);

        if (existingConversation.isPresent()) {
            return existingConversation.get();
        }

        Conversation newConversation = Conversation.builder()
                .participants(sortedParticipants)
                .build();

        return conversationRepository.save(newConversation);
    }

    public List<ConversationSummaryDTO> getUserConversations(String userEmail) {
        List<Conversation> userConversations = conversationRepository.findByParticipantEmail(userEmail);

        if (userConversations.isEmpty()) {
            return List.of();
        }

        ConversationData conversationData = prepareConversationData(userConversations, userEmail);

        return userConversations.stream()
                .map(conversation -> buildConversationSummary(conversation, userEmail, conversationData))
                .sorted(getConversationComparator())
                .collect(Collectors.toList());
    }

    private ConversationData prepareConversationData(List<Conversation> conversations, String userEmail) {
        Set<String> otherParticipantEmails = extractOtherParticipantEmails(conversations, userEmail);
        Map<String, Message> lastMessageByConversationId = loadLastMessagesForConversations(conversations);
        
        Set<String> allParticipantEmails = collectAllParticipantEmails(otherParticipantEmails, lastMessageByConversationId);
        Map<String, User> participantsByEmail = loadUsersByEmail(allParticipantEmails);
        Map<String, Long> unreadCountByConversationId = countUnreadMessagesByConversation(conversations, userEmail);

        return new ConversationData(participantsByEmail, lastMessageByConversationId, unreadCountByConversationId);
    }

    private Set<String> collectAllParticipantEmails(Set<String> otherParticipantEmails, Map<String, Message> lastMessageByConversationId) {
        Set<String> allParticipantEmails = new HashSet<>(otherParticipantEmails);
        lastMessageByConversationId.values().stream()
                .map(Message::getAuthor)
                .filter(Objects::nonNull)
                .forEach(allParticipantEmails::add);
        return allParticipantEmails;
    }

    private Set<String> extractOtherParticipantEmails(List<Conversation> conversations, String currentUserEmail) {
       return conversations.stream().flatMap(conversation -> conversation.getParticipants().stream())
                .filter(participant -> !participant.equals(currentUserEmail)).collect(Collectors.toSet());
    }


    public void sendMessage(String conversationId, String authorEmail, String messageContent) {
        Conversation conversation = findConversationOrThrow(conversationId);

        validateUserCanAccessConversation(conversation, authorEmail);
        validateMessageContent(messageContent);

        Message message = createAndSaveMessage(conversationId, authorEmail, messageContent);
        User messageAuthor = userRepository.findById(authorEmail).orElse(null);

        MessageDTO messageDTO = convertToMessageDTO(message, messageAuthor);
        notifyConversationSubscribers(conversationId, messageDTO);

    }

    public MessagePage getConversationHistory(String conversationId, String currentUserEmail, int page, int size) {
        Conversation conversation = findConversationOrThrow(conversationId);
        validateUserCanAccessConversation(conversation, currentUserEmail);

        Page<Message> messagesPage = loadMessagesPage(conversationId, page, size);
        List<Message> messages = reverseMessages(messagesPage.getContent());
        
        Map<String, User> authorsByEmail = loadAuthorsForMessages(messages);
        List<MessageDTO> messageDTOs = convertMessagesToDTOs(messages, authorsByEmail);
        
        long totalUnreadMessages = messageRepository.countByConversationIdAndReadFalseAndAuthorNot(
                conversationId, currentUserEmail);

        return MessagePage.builder()
                .items(messageDTOs)
                .hasMore(messagesPage.hasNext())
                .totalUnread(totalUnreadMessages)
                .build();
    }

    private Page<Message> loadMessagesPage(String conversationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        return messageRepository.findByConversationIdOrderByTimestampDesc(conversationId, pageable);
    }

    private List<Message> reverseMessages(List<Message> messages) {
        List<Message> reversed = new ArrayList<>(messages);
        Collections.reverse(reversed);
        return reversed;
    }

    private Map<String, User> loadAuthorsForMessages(List<Message> messages) {
        Set<String> authorEmails = messages.stream()
                .map(Message::getAuthor)
                .collect(Collectors.toSet());
        return loadUsersByEmail(authorEmails);
    }

    public void markMessagesAsRead(String conversationId, String currentUserEmail) {
        Conversation conversation = findConversationOrThrow(conversationId);
        validateUserCanAccessConversation(conversation, currentUserEmail);

        List<Message> unreadMessagesNotByUser = messageRepository.findByConversationIdAndReadFalseAndAuthorNot(
                conversationId, currentUserEmail);

        if (!unreadMessagesNotByUser.isEmpty()) {
            markAndSaveMessagesAsRead(unreadMessagesNotByUser);
            sendReadReceipt(conversationId, currentUserEmail);
        }
    }

    private void markAndSaveMessagesAsRead(List<Message> messages) {
        markMessagesRead(messages);
        messageRepository.saveAll(messages);
    }

    private void sendReadReceipt(String conversationId, String readByUser) {
        ReadReceiptDTO readReceipt = ReadReceiptDTO.builder()
                .conversationId(conversationId)
                .readByUser(readByUser)
                .build();
        messagingTemplate.convertAndSend(CONVERSATIONS_TOPIC_PREFIX + conversationId + "/read", readReceipt);
    }

    public List<UserDTO> searchAvailableUsers(String currentUserEmail, String nameQuery) {
        User currentUser = userRepository.findById(currentUserEmail)
                .orElseThrow(UserNotFoundException::new);

        UserRole oppositeRole = getOppositeRole(currentUser.getRole());

        UserFilterDTO filter = UserFilterDTO.builder()
                .role(oppositeRole)
                .name(nameQuery)
                .build();

        Specification<User> userSpecification = UserSpecification.byFilters(filter);
        List<User> candidateUsers = userRepository.findAll(userSpecification);

        return candidateUsers.stream()
                .filter(user -> permissionService.canCommunicate(currentUserEmail, user.getEmail()))
                .map(userMapper::userToUserDTO)
                .collect(Collectors.toList());
    }

    private UserRole getOppositeRole(UserRole role) {
        return role == UserRole.TEACHER ? UserRole.STUDENT : UserRole.TEACHER;
    }

    private Map<String, User> loadUsersByEmail(Set<String> emails) {
        return userRepository.findAllById(emails)
                .stream()
                .collect(Collectors.toMap(User::getEmail, user -> user));
    }

    private Map<String, Message> loadLastMessagesForConversations(List<Conversation> conversations) {
        if (conversations.isEmpty()) {
            return new HashMap<>();
        }

        List<String> conversationIds = conversations.stream()
                .map(Conversation::getId)
                .collect(Collectors.toList());

        List<Message> lastMessages = messageRepository.findLastMessagesByConversationIds(conversationIds);

        return lastMessages.stream()
                .collect(Collectors.toMap(Message::getConversationId, message -> message));
    }

    private Map<String, Long> countUnreadMessagesByConversation(List<Conversation> conversations, String currentUserEmail) {
        if (conversations.isEmpty()) {
            return new HashMap<>();
        }

        List<String> conversationIds = extractConversationIds(conversations);
        List<ConversationCount> unreadCountResults = messageRepository.countUnreadByConversationIds(conversationIds, currentUserEmail);

        Map<String, Long> unreadCountByConversationId = mapUnreadCountResults(unreadCountResults);
        ensureAllConversationsHaveCount(conversationIds, unreadCountByConversationId);

        return unreadCountByConversationId;
    }

    private Map<String, Long> mapUnreadCountResults(List<ConversationCount> unreadCountResults) {
        return unreadCountResults.stream()
                .filter(count -> count.getConversationId() != null && count.getUnreadMessages() != null)
                .collect(Collectors.toMap(
                        ConversationCount::getConversationId,
                        ConversationCount::getUnreadMessages
                ));
    }

    private List<String> extractConversationIds(List<Conversation> conversations) {
        return conversations.stream()
                .map(Conversation::getId)
                .collect(Collectors.toList());
    }


    private void ensureAllConversationsHaveCount(List<String> conversationIds, Map<String, Long> unreadCountByConversationId) {
        for (String conversationId : conversationIds) {
            unreadCountByConversationId.putIfAbsent(conversationId, 0L);
        }
    }

    private ConversationSummaryDTO buildConversationSummary(
            Conversation conversation,
            String currentUserEmail,
            ConversationData conversationData) {

        String otherParticipantEmail = findOtherParticipantsEmails(conversation.getParticipants(), currentUserEmail);
        User otherParticipant = conversationData.getParticipantsByEmail().get(otherParticipantEmail);

        Message lastMessage = conversationData.getLastMessageByConversationId().get(conversation.getId());
        MessageDTO lastMessageDTO = buildLastMessageDTO(lastMessage, conversationData.getParticipantsByEmail());

        long unreadCount = conversationData.getUnreadCountByConversationId().getOrDefault(conversation.getId(), 0L);

        return buildConversationSummaryDTO(conversation, otherParticipantEmail, otherParticipant, lastMessageDTO, unreadCount, lastMessage);
    }

    private ConversationSummaryDTO buildConversationSummaryDTO(Conversation conversation, String otherParticipantEmail, User otherParticipant, MessageDTO lastMessageDTO, long unreadCount, Message lastMessage) {
        if (otherParticipant == null) {
            log.warn("Other participant not found for email: {} in conversation: {}", otherParticipantEmail, conversation.getId());
        }
        
        return ConversationSummaryDTO.builder()
                .id(conversation.getId())
                .otherParticipantEmail(otherParticipantEmail)
                .otherParticipantName(otherParticipant != null ? formatUserFullName(otherParticipant) : "Usuario desconocido")
                .otherParticipantRole(otherParticipant != null ? otherParticipant.getRole().toString() : "")
                .lastMessage(lastMessageDTO)
                .unreadCount(unreadCount)
                .lastMessageAt(lastMessage != null ? lastMessage.getTimestamp() : null)
                .build();
    }

    private MessageDTO buildLastMessageDTO(Message lastMessage, Map<String, User> participantsByEmail) {
        if (lastMessage == null) {
            return null;
        }
        User author = participantsByEmail.get(lastMessage.getAuthor());
        return convertToMessageDTO(lastMessage, author);
    }

    private Comparator<ConversationSummaryDTO> getConversationComparator() {
        return Comparator.comparing((ConversationSummaryDTO dto) -> dto.getUnreadCount() == 0)
                .thenComparing(
                        ConversationSummaryDTO::getLastMessageAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                );
    }

    private String findOtherParticipantsEmails(List<String> participants, String currentUserEmail) {
        return participants.stream()
                .filter(email -> !email.equals(currentUserEmail))
                .findFirst().orElseThrow(NotFoundParticipationException::new);
    }

    private Conversation findConversationOrThrow(String conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Conversación no encontrada"));
    }

    public void validateUserCanAccessByConversationId(String conversationId, String userEmail) {
        Conversation conversation = findConversationOrThrow(conversationId);
        validateUserCanAccessConversation(conversation, userEmail);
    }

    private void validateUserCanAccessConversation(Conversation conversation, String userEmail) {
        if (!conversation.getParticipants().contains(userEmail)) {
            throw new UnauthorizedConversationAccessException("No tienes acceso a esta conversación");
        }
    }

    private void validateMessageContent(String messageContent) {
        if (messageContent == null || messageContent.trim().isEmpty()) {
            throw new InvalidMessageException("El contenido no puede estar vacío");
        }

        if (messageContent.length() > MAX_MESSAGE_LENGTH) {
            throw new InvalidMessageException("El mensaje no puede superar los " + MAX_MESSAGE_LENGTH + " caracteres");
        }
    }

    private Message createAndSaveMessage(String conversationId, String authorEmail, String messageContent) {
        Message message = Message.builder()
                .conversationId(conversationId)
                .author(authorEmail)
                .content(messageContent.trim())
                .read(false)
                .timestamp(Instant.now())
                .build();

        return messageRepository.save(message);
    }

    private void notifyConversationSubscribers(String conversationId, MessageDTO messageDTO) {
        messagingTemplate.convertAndSend(CONVERSATIONS_TOPIC_PREFIX + conversationId, messageDTO);
    }

    private List<MessageDTO> convertMessagesToDTOs(List<Message> messages, Map<String, User> authorsByEmail) {
        return messages.stream()
                .map(message -> convertToMessageDTO(message, authorsByEmail.get(message.getAuthor())))
                .collect(Collectors.toList());
    }

    private MessageDTO convertToMessageDTO(Message message, User author) {
        return MessageDTO.builder()
                .id(message.getId())
                .conversationId(message.getConversationId())
                .author(message.getAuthor())
                .authorName(formatUserFullName(author))
                .content(message.getContent())
                .read(message.isRead())
                .timestamp(message.getTimestamp())
                .build();
    }

    private String formatUserFullName(User user) {
        if (user == null) {
            return "Usuario desconocido";
        }
        return user.getName() + " " + user.getLastname();
    }

    private void markMessagesRead(List<Message> messagesToMark) {
        messagesToMark.forEach(message -> message.setRead(true));
    }

}
