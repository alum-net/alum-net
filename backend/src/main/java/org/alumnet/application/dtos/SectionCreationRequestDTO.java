package org.alumnet.application.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SectionCreationRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    private String title;
    @Length(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String description;
    private List<ResourceMetadataDTO> resourcesMetadata;
}
