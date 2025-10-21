package org.alumnet.infrastructure.exceptions;

public class AlreadyEnrolledStudentException extends RuntimeException {
    public AlreadyEnrolledStudentException() {
        super("El estudiante ya está matriculado en el curso");
    }
}
