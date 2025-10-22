package org.alumnet.application.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResultResponse <T>{
    private boolean success;
    private String message;
    private int statusCode;
    private T data;
    @Builder.Default
    private List<String> errors = new ArrayList<>();

    public void addError(String error) {
        this.errors.add(error);
        this.success = false;
    }

    public static <T> ResultResponse<T> success(T data, String message) {
        ResultResponse<T> response = new ResultResponse<>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        response.setErrors(null);
        return response;
    }

    public static <T> ResultResponse<T> error(List<String> errors, String message, int statusCode) {
        ResultResponse<T> response = new ResultResponse<>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setData(null);
        response.setStatusCode(statusCode);
        response.setErrors(errors);
        return response;
    }

    public static <T> ResultResponse<T> error(String error, String message, int statusCode) {
        return error(Collections.singletonList(error), message, statusCode);
    }

}
