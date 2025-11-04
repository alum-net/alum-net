package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventGradeDetailResponseDTO {
    private Double grade;
    private Double maxGrade;
    private boolean isUnrated;
}
