package org.alumnet.application.dtos.requests;

import lombok.Data;

@Data
public class UpdatePostRequestDTO {
    private String content;
    private String title;
}
