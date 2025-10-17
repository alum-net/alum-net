package org.alumnet.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultResponse {
    private boolean success;
    private String message;
    private List<String> errors;

    public void addError(String error) {
        this.errors.add(error);
        this.success = false;
    }




}
