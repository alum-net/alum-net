package org.alumnet.infrastructure.exceptions;

public class AssignmentDueDateExpiredException extends RuntimeException {
    public AssignmentDueDateExpiredException(String message) {
        super(message);
    }
}
