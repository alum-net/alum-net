package org.alumnet.infrastructure.exceptions;

public class InvalidPostTitleException extends RuntimeException {
    public InvalidPostTitleException() {
        super("Las respuestas no pueden tener título.");
    }
}
