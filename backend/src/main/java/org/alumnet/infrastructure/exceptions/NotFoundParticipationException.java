package org.alumnet.infrastructure.exceptions;

public class NotFoundParticipationException extends RuntimeException {
    public NotFoundParticipationException() {
        super("Participante invalido");
    }
}
