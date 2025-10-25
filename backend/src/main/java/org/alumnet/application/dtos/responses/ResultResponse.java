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
    private String message;
    private T data;
    @Builder.Default
    private List<String> errors = new ArrayList<>();

    public void addError(String error){
        errors.add(error);
    }

    public static <T> ResultResponse<T> success(T data, String message) {
        ResultResponse<T> response = new ResultResponse<>();
        response.setMessage(message);
        response.setData(data);
        response.setErrors(null);
        return response;
    }

    public static <T> ResultResponse<T> error(List<String> errors, String message) {
        ResultResponse<T> response = new ResultResponse<>();
        response.setMessage(message);
        response.setData(null);
        response.setErrors(errors);
        return response;
    }

    public static <T> ResultResponse<T> error(String error, String message) {
        return error(Collections.singletonList(error), message);
    }

}
