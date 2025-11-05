package org.alumnet.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDTO {
    private Integer questionId;
    private Integer answerId;
    private boolean isCorrect;
    private LocalDateTime timeStamp;
}
