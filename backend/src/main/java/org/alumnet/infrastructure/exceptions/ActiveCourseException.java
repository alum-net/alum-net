package org.alumnet.infrastructure.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ActiveCourseException extends RuntimeException {
    public ActiveCourseException(String message) {
        super(message);
    }
}