package org.alumnet.infrastructure.exceptions;

public class LabelNotFoundException extends RuntimeException {
    public LabelNotFoundException() {
        super("No se encontró la etiqueta");
    }
}
