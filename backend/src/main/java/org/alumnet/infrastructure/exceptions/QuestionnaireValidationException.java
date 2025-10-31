package org.alumnet.infrastructure.exceptions;

public class QuestionnaireValidationException extends RuntimeException {
    public QuestionnaireValidationException(String message) {
        super(message);
    }
}
