package org.alumnet.infrastructure.exceptions;

public class EventHasParticipationException extends RuntimeException {
    public EventHasParticipationException() {
        super("El evento contiene participaciones");
    }
}
