package org.alumnet.infrastructure.exceptions;

public class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException() {
        super("Curso no encontrado");
    }
}
