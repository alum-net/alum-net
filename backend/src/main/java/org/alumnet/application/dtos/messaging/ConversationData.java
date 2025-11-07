package org.alumnet.application.dtos.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.alumnet.domain.messaging.Message;
import org.alumnet.domain.users.User;

import java.util.Map;

@Data
@AllArgsConstructor
public class ConversationData {
    private Map<String, User> participantsByEmail;
    private Map<String, Message> lastMessageByConversationId;
    private Map<String, Long> unreadCountByConversationId;
}

