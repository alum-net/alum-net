package org.alumnet.infrastructure.exceptions;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException() {
        super("No se encontró el post");
    }
}
