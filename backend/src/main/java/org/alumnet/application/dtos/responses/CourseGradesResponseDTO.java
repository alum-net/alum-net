package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CourseGradesResponseDTO {
    private Double finalGrade;
    private Double approvalGrade;
    private boolean isApproved;
    private boolean isUnrated;
    private List<EventGradeDetailResponseDTO> eventGrades;
}
