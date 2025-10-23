package org.alumnet.application.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.dtos.SectionResourceDTO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SectionDTO {
    private String title;
    private String description;
    private List<SectionResourceDTO> sectionResources;

}
