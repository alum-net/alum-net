package org.alumnet.application.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuestionnaireResponseDTO {
    private String studentEmail;
    private String name;
    private List<QuestionResponseDTO> responses;
}
