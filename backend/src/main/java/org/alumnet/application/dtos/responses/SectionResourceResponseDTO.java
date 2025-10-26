package org.alumnet.application.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionResourceResponseDTO {
    private Integer order;
    private String name;
    private String extension;
    private String url;

}
