package org.alumnet.infrastructure.exceptions;

public class HomeworkAlreadySubmittedException extends RuntimeException {
    public HomeworkAlreadySubmittedException(String message) {
        super(message);
    }
}
