package org.alumnet.infrastructure.exceptions;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException() {
        super("No existe el evento");
    }
}
