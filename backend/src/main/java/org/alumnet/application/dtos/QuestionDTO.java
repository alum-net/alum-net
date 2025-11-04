package org.alumnet.application.dtos;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Integer id;
    private String text;
    @Size(min = 2, message = "La pregunta debe tener al menos 2 respuestas")
    private List<AnswerDTO> answers;
}
