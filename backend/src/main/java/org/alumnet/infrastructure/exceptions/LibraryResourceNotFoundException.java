package org.alumnet.infrastructure.exceptions;

public class LibraryResourceNotFoundException extends RuntimeException {
    public LibraryResourceNotFoundException() {
        super("No existe el recurso solicitado");
    }
}
