package org.alumnet.application.dtos.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationCount {
    private String conversationId;
    private Long unreadMessages;
}

