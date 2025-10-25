package org.alumnet.infrastructure.exceptions;

public class InvalidPostContentLenghtException extends RuntimeException {
    public InvalidPostContentLenghtException() {
        super("El mensaje supera los 350 caracteres");
    }
}
