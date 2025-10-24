package org.alumnet.infrastructure.exceptions;

import jakarta.validation.ConstraintViolationException;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.InvalidMimeTypeException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResultResponse<Object>> handleGeneralException(Exception ex) {
        return ResponseEntity.internalServerError().body(ResultResponse.error(ex.getMessage(), "Ha ocurrido un error inesperado"));
    }
    @ExceptionHandler (ConstraintViolationException.class)
    public ResponseEntity<ResultResponse<Object>> handleValidationException(ConstraintViolationException ex) {
        return ResponseEntity.badRequest().body(ResultResponse.error(ex.getMessage(), "Error de validación"));
    }
    @ExceptionHandler(FileException.class)
    public ResponseEntity<ResultResponse<Object>> handleInvalidExtensionException(FileException ex) {
        return ResponseEntity.badRequest().body(ResultResponse.error(ex.getMessage(), "Error validando el archivo"));
    }
    @ExceptionHandler(InvalidMimeTypeException.class)
    public ResponseEntity<ResultResponse<Object>> handleInvalidMimeTypeException(InvalidMimeTypeException ex) {
        return ResponseEntity.badRequest().body(ResultResponse.error(ex.getMessage(), "Tipo MIME no válido"));
    }
    @ExceptionHandler(ExistingUserException.class)
    public ResponseEntity<ResultResponse<Object>> handleExistingUserException(ExistingUserException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ResultResponse.error(ex.getMessage(), "El usuario ya existe"));
    }
    @ExceptionHandler(EnrollmentNotFoundException.class)
    public ResponseEntity<ResultResponse<Object>> handleEnrollmentNotFoundException(EnrollmentNotFoundException ex) {
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResultResponse.error(ex.getMessage(), "El usuario no está matriculado al curso"));
    }

    @ExceptionHandler(CourseNotFoundException.class)
    public ResponseEntity<ResultResponse<Object>> handleCourseNotFoundException(CourseNotFoundException ex) {
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResultResponse.error(ex.getMessage(), "Nose encontró el curso"));
    }
}
