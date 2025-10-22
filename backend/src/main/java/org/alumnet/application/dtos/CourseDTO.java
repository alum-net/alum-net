package org.alumnet.application.dtos;

import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.ShiftType;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class CourseDTO {
    private String name;
    private String description;
    private double approvalGrade;
    private Date startDate;
    private Date endDate;
    private int year;
    private List<UserDTO> teachers;
    private ShiftType shiftType;
}
