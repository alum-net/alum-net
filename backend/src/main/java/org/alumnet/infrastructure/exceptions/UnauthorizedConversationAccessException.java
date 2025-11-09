package org.alumnet.infrastructure.exceptions;

public class UnauthorizedConversationAccessException extends RuntimeException {
    public UnauthorizedConversationAccessException(String message) {
        super(message);
    }
}