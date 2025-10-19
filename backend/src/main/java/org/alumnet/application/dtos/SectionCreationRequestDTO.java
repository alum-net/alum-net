package org.alumnet.application.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionCreationRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    @NotNull(message = "El título no puede ser nulo")
    private String title;
}
