package org.alumnet.infrastructure.exceptions;

public class NoPendingChangesException extends RuntimeException {
    public NoPendingChangesException() {
        super("No hay cambios pendientes para la clase");
    }
}
