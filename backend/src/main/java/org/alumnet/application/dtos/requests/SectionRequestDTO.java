package org.alumnet.application.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.alumnet.application.dtos.ResourceMetadataDTO;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SectionRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    private String title;
    @Length(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String description;
    private List<ResourceMetadataDTO> resourcesMetadata;
}
