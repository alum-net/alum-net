package org.alumnet.application.dtos.requests;

import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.ShiftType;

@Data
@Builder
public class CourseFilterDTO {
    private String name;
    private Integer year;
    private String teacherEmail;
    private ShiftType shift;
    private String userEmail;
}
