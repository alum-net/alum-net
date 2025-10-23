package org.alumnet.application.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.SectionDTO;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class CourseContentDTO {
    PageableResultResponse<SectionDTO> sections;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    List<String> enrolledStudents;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Integer totalEnrollments;
}
