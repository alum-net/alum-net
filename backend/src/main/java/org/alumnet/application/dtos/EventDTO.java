package org.alumnet.application.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EventDTO {
    @NotBlank(message = "El tipo no puede ser nulo o vacio")
    private String type;
    @NotNull(message = "El ID de la seccion no puede ser nulo")
    private Integer sectionId;
    @NotBlank(message = "El titulo no puede ser nulo o vacio")
    private String title;
    @NotBlank(message = "El titulo no puede ser nulo o vacio")
    private String description;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime startDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime endDate;
    @Min(value = 0, message = "La nota maxima debe ser al menos 0")
    @Max(value = 100, message = "La nota maxima no puede ser mayor a 100")
    private Integer maxGrade;
    private List<QuestionDTO> questions;
    @Min(value = 1, message = "La duracion debe ser al menos 1 minuto")
    private Integer durationInMinutes;

}
