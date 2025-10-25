package org.alumnet.infrastructure.exceptions;

public class SectionNotFoundException extends RuntimeException {
    public SectionNotFoundException() {
        super("Seccion no encontrada");
    }
}
