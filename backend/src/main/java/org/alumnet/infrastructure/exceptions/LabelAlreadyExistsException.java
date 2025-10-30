package org.alumnet.infrastructure.exceptions;

public class LabelAlreadyExistsException extends RuntimeException {
    public LabelAlreadyExistsException() {
        super("Ya existe la etiqueta");
    }
}
