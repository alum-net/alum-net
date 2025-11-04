package org.alumnet.application.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuestionResponseDTO {
    private Integer questionId;
    private Integer answerId;
    private boolean isCorrect;
    private LocalDateTime timeStamp;
}
