package org.alumnet.infrastructure.exceptions;

public class InsufficientPermissionsException extends RuntimeException {
    public InsufficientPermissionsException() {
       super("El usuario no tiene permisos suficientes o no esta inscripto en el curso");
    }
}
