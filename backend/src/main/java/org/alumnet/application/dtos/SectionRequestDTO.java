package org.alumnet.application.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    protected String title;
    @Length(max = 500, message = "La descripción no puede superar los 500 caracteres")
    protected String description;
}
