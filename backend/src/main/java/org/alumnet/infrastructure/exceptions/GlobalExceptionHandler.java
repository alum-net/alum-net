package org.alumnet.infrastructure.exceptions;

import jakarta.validation.ConstraintViolationException;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.InvalidMimeTypeException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.xml.transform.Result;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResultResponse<Object>> handleGeneralException(Exception ex) {
        return ResponseEntity.internalServerError().body(ResultResponse.error(ex.getMessage(), "Ha ocurrido un error inesperado"));
    }
    @ExceptionHandler (ConstraintViolationException.class)
    public ResponseEntity<ResultResponse<Object>> handleValidationException(ConstraintViolationException ex) {
        ResultResponse result = ResultResponse.builder().message("Error de validación").build();

        ex.getConstraintViolations()
                .forEach(error -> result.addError(error.getMessage()));

        return ResponseEntity.badRequest().body(result);
    }
    @ExceptionHandler (MethodArgumentNotValidException.class)
    public ResponseEntity<ResultResponse<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        ResultResponse result = ResultResponse.builder().message("Error de validación").build();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> result.addError(error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(result);
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

    @ExceptionHandler(InvalidPostContentLenghtException.class)
    public ResponseEntity<ResultResponse<Object>> handleInvalidPostContentLenghtException(InvalidPostContentLenghtException ex) {
        return  ResponseEntity.badRequest().body(ResultResponse.error(ex.getMessage(), "Formato incorrecto"));
    }

    @ExceptionHandler(InvalidPostTitleException.class)
    public ResponseEntity<ResultResponse<Object>> handleInvalidPostTitleException(InvalidPostTitleException ex) {
        return  ResponseEntity.badRequest().body(ResultResponse.error(ex.getMessage(), "Formato incorrecto"));
    }

    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<ResultResponse<Object>> handlePostNotFoundException(PostNotFoundException ex) {
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResultResponse.error(ex.getMessage(), "No se encontró el post"));
    }

    @ExceptionHandler(PostHasRepliesException.class)
    public ResponseEntity<ResultResponse<Object>> handlePostHasRepliesException(PostHasRepliesException ex) {
        return  ResponseEntity.status(HttpStatus.CONFLICT).body(ResultResponse.error(ex.getMessage(), "No se puede modificar el post"));
    }

    @ExceptionHandler(NoPendingChangesException.class)
    public ResponseEntity<ResultResponse<Object>> handleNoPendingChangesException(NoPendingChangesException ex) {
        return  ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(ResultResponse.error(ex.getMessage(), "No hay cambios pendientes"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResultResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return  ResponseEntity.badRequest().body(ResultResponse.error(ex.getMessage(), "Error en el procesamiento"));
    }

    @ExceptionHandler(LabelAlreadyExistsException.class)
    public ResponseEntity<ResultResponse<Object>> handleLabelAlreadyExistsException(LabelAlreadyExistsException ex){
        return  ResponseEntity.badRequest().body(ResultResponse.error(ex.getMessage(), "Ya existe la etiqueta"));
    }

    @ExceptionHandler(LabelNotFoundException.class)
    public ResponseEntity<ResultResponse<Object>> handleLabelNotFoundException(LabelNotFoundException ex){
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResultResponse.error(ex.getMessage(), "No se encontró la etiqueta"));
    }
}
