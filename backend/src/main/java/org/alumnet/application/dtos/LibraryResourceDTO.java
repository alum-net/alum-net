package org.alumnet.application.dtos;

import lombok.Data;

import java.util.List;

@Data
public class LibraryResourceDTO {
    private Integer id;

    private String title;
    private List<LabelDTO> labels;

    private String name;
    private String url;
    private String extension;
    private Long sizeInBytes;

    private UserDTO creator;
}
