package org.alumnet.infrastructure.exceptions;

import jakarta.validation.ConstraintViolationException;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.util.InvalidMimeTypeException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResultResponse<Object> handleGeneralException(Exception ex) {
        return ResultResponse.error(ex.getMessage(), "Ha ocurrido un error inesperado", HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
    @ExceptionHandler (ConstraintViolationException.class)
    public ResultResponse<Object> handleValidationException(ConstraintViolationException ex) {
        return ResultResponse.error(ex.getMessage(), "Error de validación", HttpStatus.BAD_REQUEST.value());
    }
    @ExceptionHandler(FileException.class)
    public ResultResponse<Object> handleInvalidExtensionException(FileException ex) {
        return ResultResponse.error(ex.getMessage(), "Error validando el archivo", HttpStatus.BAD_REQUEST.value());
    }
    @ExceptionHandler(InvalidMimeTypeException.class)
    public ResultResponse<Object> handleInvalidMimeTypeException(InvalidMimeTypeException ex) {
        return ResultResponse.error(ex.getMessage(), "Tipo MIME no válido", HttpStatus.BAD_REQUEST.value());
    }
    @ExceptionHandler(ExistingUserException.class)
    public ResultResponse<Object> handleExistingUserException(ExistingUserException ex) {
        return ResultResponse.error(ex.getMessage(), "El usuario ya existe", HttpStatus.CONFLICT.value());
    }



}
