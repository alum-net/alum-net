package org.alumnet.application.dtos.requests;

import lombok.Data;

import java.util.List;

@Data
public class LibraryResourceCreationRequestDTO {
    private String creatorEmail;
    private String title;
    private List<Integer> labelIds;
}
