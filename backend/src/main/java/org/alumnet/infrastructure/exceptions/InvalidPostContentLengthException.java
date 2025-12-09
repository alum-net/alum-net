package org.alumnet.infrastructure.exceptions;

public class InvalidPostContentLengthException extends RuntimeException {
    public InvalidPostContentLengthException() {
        super("El mensaje supera los 350 caracteres");
    }
}
