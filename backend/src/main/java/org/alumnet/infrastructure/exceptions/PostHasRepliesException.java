package org.alumnet.infrastructure.exceptions;

public class PostHasRepliesException extends RuntimeException {
    public PostHasRepliesException() {
        super("El post ya tiene respuestas y no puede modificarse");
    }
}
