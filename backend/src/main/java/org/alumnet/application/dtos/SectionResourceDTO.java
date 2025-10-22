package org.alumnet.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionResourceDTO {
    private String title;
    private String name;
    private String extension;
    private String url;

}
