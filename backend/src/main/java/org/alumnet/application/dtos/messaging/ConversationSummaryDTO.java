package org.alumnet.application.dtos.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationSummaryDTO {
    private String id;
    private String otherParticipantEmail;
    private String otherParticipantName;
    private String otherParticipantRole;
    private MessageDTO lastMessage;
    private long unreadCount;
    private Instant lastMessageAt;
}