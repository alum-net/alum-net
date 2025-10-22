package org.alumnet.application.dtos;

import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.ShiftType;
import org.alumnet.application.enums.UserRole;

@Data
@Builder
public class CourseFilterDTO {
    private String name;
    private Integer year;
    private String teacherEmail;
    private ShiftType shiftType;
    private String userEmail;
    private UserRole role;
}
