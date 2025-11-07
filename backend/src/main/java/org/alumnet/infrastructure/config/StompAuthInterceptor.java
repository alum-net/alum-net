package org.alumnet.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.alumnet.application.services.MessageService;
import org.alumnet.infrastructure.exceptions.ConversationNotFoundException;
import org.alumnet.infrastructure.exceptions.UnauthorizedConversationAccessException;
import org.alumnet.infrastructure.security.JwtAuthConverter;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class StompAuthInterceptor implements ChannelInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String CONVERSATIONS_TOPIC_PREFIX = "/topic/conversations/";

    private final JwtDecoder jwtDecoder;
    private final JwtAuthConverter jwtAuthConverter;
    private final MessageService messageService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (headerAccessor != null) {
            if (StompCommand.CONNECT.equals(headerAccessor.getCommand())) {
                authenticateConnection(headerAccessor);
            } else if (StompCommand.SUBSCRIBE.equals(headerAccessor.getCommand())) {
                validateSubscription(headerAccessor);
            }
        }

        return message;
    }

    private void authenticateConnection(StompHeaderAccessor headerAccessor) {
        String token = findTokenInHeaders(headerAccessor);

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token JWT requerido");
        }

        try {
            Jwt jwt = jwtDecoder.decode(token);
            Authentication authentication = jwtAuthConverter.convert(jwt);
            headerAccessor.setUser(authentication);

        } catch (Exception exception) {
            throw new IllegalArgumentException("Token JWT inválido: " + exception.getMessage());
        }
    }

    private void validateSubscription(StompHeaderAccessor headerAccessor) {
        Authentication auth = (Authentication) headerAccessor.getUser();

        if (auth == null) {
            throw new IllegalArgumentException("Usuario no autenticado");
        }

        String destination = headerAccessor.getDestination();

        if (destination != null && destination.startsWith(CONVERSATIONS_TOPIC_PREFIX)) {
            String conversationId = extractConversationId(destination);

            if (conversationId == null || conversationId.isBlank()) {
                throw new IllegalArgumentException("ID de conversación inválido en el destino: " + destination);
            }

            String userEmail = auth.getName();

            try {
                messageService.validateUserCanAccessConversation(conversationId, userEmail);
                log.debug("Suscripción autorizada: usuario {} a conversación {}", userEmail, conversationId);
            } catch (ConversationNotFoundException e) {
                log.warn("Intento de suscripción a conversación inexistente: {} por usuario: {}", 
                        conversationId, userEmail);
                throw new IllegalArgumentException("Conversación no encontrada");
            } catch (UnauthorizedConversationAccessException e) {
                log.warn("Intento de suscripción no autorizado a conversación: {} por usuario: {}", 
                        conversationId, userEmail);
                throw new IllegalArgumentException("No autorizado para suscribirse a esta conversación");
            }
        }
    }

    private String extractConversationId(String destination) {
        if (destination.startsWith(CONVERSATIONS_TOPIC_PREFIX)) {
            String afterPrefix = destination.substring(CONVERSATIONS_TOPIC_PREFIX.length());

            int slashIndex = afterPrefix.indexOf('/');
            return slashIndex > 0 ? afterPrefix.substring(0, slashIndex) : afterPrefix;
        }
        return null;
    }

    private String findTokenInHeaders(StompHeaderAccessor headerAccessor) {
        String authHeader = headerAccessor.getFirstNativeHeader("Authorization");
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length());
        }

        return headerAccessor.getFirstNativeHeader("token");
    }

    public StompAuthInterceptor(
            JwtDecoder jwtDecoder,
            JwtAuthConverter jwtAuthConverter,
            @Lazy MessageService messageService) {
        this.jwtDecoder = jwtDecoder;
        this.jwtAuthConverter = jwtAuthConverter;
        this.messageService = messageService;
    }
}
