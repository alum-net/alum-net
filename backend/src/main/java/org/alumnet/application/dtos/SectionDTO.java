package org.alumnet.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.dtos.responses.SectionResourceResponseDTO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SectionDTO {
    private String title;
    private String description;
    private List<SectionResourceResponseDTO> sectionResources;

}
