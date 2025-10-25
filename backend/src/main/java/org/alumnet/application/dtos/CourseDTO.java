package org.alumnet.application.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.ShiftType;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class CourseDTO {
    private String id;
    private String name;
    private String description;
    private double approvalGrade;
    private Date startDate;
    private Date endDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy", timezone = "UTC")
    private Date year;
    private List<UserDTO> teachers;
    private ShiftType shift;
}
