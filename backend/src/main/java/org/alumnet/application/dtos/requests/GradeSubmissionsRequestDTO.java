package org.alumnet.application.dtos.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.dtos.StudentSubmissionDTO;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeSubmissionsRequestDTO {
    @NotEmpty(message = "La lista de estudiantes no puede ser vacía")
    private List<StudentSubmissionDTO> students;
    private Integer eventId;
    private Integer courseId;

}
