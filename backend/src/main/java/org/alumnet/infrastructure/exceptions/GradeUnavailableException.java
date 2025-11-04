package org.alumnet.infrastructure.exceptions;

public class GradeUnavailableException extends RuntimeException {
    public GradeUnavailableException() {
        super("Notas no disponibles.");
    }
}
