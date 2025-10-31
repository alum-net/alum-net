package org.alumnet.infrastructure.exceptions;

public class LibraryResourceAlreadyExistsException extends RuntimeException {
    public LibraryResourceAlreadyExistsException() {
        super("Ya existe un recurso en la librería con el mismo nombre");
    }
}
