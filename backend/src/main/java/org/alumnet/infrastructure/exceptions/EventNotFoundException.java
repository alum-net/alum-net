package org.alumnet.infrastructure.exceptions;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException() {
        super("Evento no encontrado");
    }
}
