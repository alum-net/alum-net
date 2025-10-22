package org.alumnet.infrastructure.exceptions;

public class EnrollmentNotFoundException extends RuntimeException{
    public EnrollmentNotFoundException() {
        super("No se encontró la inscripción");
    }
}
