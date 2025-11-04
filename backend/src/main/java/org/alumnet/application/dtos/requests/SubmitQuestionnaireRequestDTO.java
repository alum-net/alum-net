package org.alumnet.application.dtos.requests;

import lombok.Data;
import org.alumnet.application.dtos.QuestionResponseDTO;

import java.util.List;

@Data
public class SubmitQuestionnaireRequestDTO {
    private String userEmail;
    private List<QuestionResponseDTO> responses;
}
