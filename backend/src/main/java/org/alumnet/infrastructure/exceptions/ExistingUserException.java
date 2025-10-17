package org.alumnet.infrastructure.exceptions;

import jakarta.validation.constraints.Email;

public class ExistingUserException extends Exception {
    public ExistingUserException(String email) {
        super("User with email " + email + " already exists.");
    }
}
