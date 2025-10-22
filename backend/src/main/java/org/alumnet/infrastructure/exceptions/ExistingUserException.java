package org.alumnet.infrastructure.exceptions;


public class ExistingUserException extends RuntimeException {
    public ExistingUserException(String email) {
        super("User with email " + email + " already exists.");
    }
}
