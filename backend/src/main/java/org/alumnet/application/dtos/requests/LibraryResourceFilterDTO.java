package org.alumnet.application.dtos.requests;

import lombok.Data;

import java.util.List;

@Data
public class LibraryResourceFilterDTO {
    private String name; // debe compararse tanto con título como con filename
    private List<Integer> labelIds;
}
