package org.alumnet.application.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.enums.ShiftType;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseCreationRequestDTO {

    @NotBlank(message = "El nombre del curso no puede estar vacío")
    private String name;

    @NotBlank(message = "La descripción del curso no puede estar vacía")
    private String description;

    @NotNull(message = "Debe seleccionarse un turno (Matutino, Vespertino o Nocturno)")
    private ShiftType shift;

    @NotNull(message = "Debe especificarse la nota mínima de aprobación")
    private Double approvalGrade;

    @NotNull(message = "La fecha de inicio no puede ser nula")
    private LocalDate startDate;

    @NotNull(message = "La fecha de fin no puede ser nula")
    private LocalDate endDate;

    @NotNull(message = "Debe asignarse al menos un docente")
    @Size(min = 1, message = "Debe asignarse al menos un docente")
    private List<@Email String> teachersEmails;

}
