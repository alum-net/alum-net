package org.alumnet.infrastructure.exceptions;

public class CourseParticipationNotFoundException extends RuntimeException {
    public CourseParticipationNotFoundException() {
        super("El usuario no se encuentra inscripto en el curso.");
    }
}
