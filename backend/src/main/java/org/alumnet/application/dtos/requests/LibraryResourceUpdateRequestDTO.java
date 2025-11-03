package org.alumnet.application.dtos.requests;

import lombok.Data;

import java.util.List;

@Data
public class LibraryResourceUpdateRequestDTO {
    private String currentUserEmail;
    private String title;
    private List<Integer> labelIds;
}
