package org.alumnet.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.messaging.SendMessageRequest;
import org.alumnet.application.dtos.messaging.TypingEvent;
import org.alumnet.application.services.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class MessageWsController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/conversations/{conversationId}/send")
    public void handleSendMessage(
            @DestinationVariable String conversationId,
            SendMessageRequest request,
            Authentication authentication) {

        String senderEmail = authentication.getName();
        messageService.sendMessage(conversationId, senderEmail, request.getContent());
    }

    @MessageMapping("/conversations/{conversationId}/typing")
    public void handleTypingEvent(
            @DestinationVariable String conversationId,
            TypingEvent typingEvent,
            Authentication authentication) {

        String typingUserEmail = authentication.getName();
        typingEvent.setUserEmail(typingUserEmail);

        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId + "/typing",
                typingEvent
        );
    }
}
