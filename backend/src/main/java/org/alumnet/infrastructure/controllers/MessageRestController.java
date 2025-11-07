package org.alumnet.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.messaging.ConversationSummaryDTO;
import org.alumnet.application.dtos.messaging.MessagePage;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.MessageService;
import org.alumnet.domain.messaging.Conversation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageRestController {

    private final MessageService messageService;

    @GetMapping("/conversations")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<List<ConversationSummaryDTO>>> getUserConversations(
            Authentication authentication) {

        String authenticatedUserEmail = authentication.getName();
        List<ConversationSummaryDTO> conversations = messageService.getUserConversations(authenticatedUserEmail);

        return ResponseEntity.ok(ResultResponse.success(conversations, "Conversaciones obtenidas exitosamente"));
    }

    @GetMapping("/conversations/with/{otherUserEmail}")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<String>> getOrCreateConversation(
            @PathVariable String otherUserEmail,
            Authentication authentication) {

        String currentUserEmail = authentication.getName();
        Conversation conversation = messageService.getOrCreateConversation(currentUserEmail, otherUserEmail);

        return ResponseEntity.ok(ResultResponse.success(conversation.getId(), "Conversación lista"));
    }

    @GetMapping("/{conversationId}")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<MessagePage>> getConversationHistory(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size,
            Authentication authentication) {

        String authenticatedUserEmail = authentication.getName();
        MessagePage conversationHistory = messageService.getConversationHistory(
                conversationId, authenticatedUserEmail, page, size);

        return ResponseEntity.ok(ResultResponse.success(conversationHistory, "Historial obtenido exitosamente"));
    }

    @PostMapping("/{conversationId}/read")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<Object>> markMessagesAsRead(
            @PathVariable String conversationId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        messageService.markMessagesAsRead(conversationId, userEmail);

        return ResponseEntity.ok(ResultResponse.success(null, "Mensajes marcados como leídos"));
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<List<UserDTO>>> searchAvailableUsers(
            @RequestParam(required = false) String name,
            Authentication authentication) {

        String authenticatedUserEmail = authentication.getName();
        List<UserDTO> searchResults = messageService.searchAvailableUsers(authenticatedUserEmail, name);

        return ResponseEntity.ok(ResultResponse.success(searchResults, "Usuarios encontrados exitosamente"));
    }
}
