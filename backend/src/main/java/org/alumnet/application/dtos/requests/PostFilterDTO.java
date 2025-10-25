package org.alumnet.application.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.alumnet.application.enums.ForumType;

@Data
public class PostFilterDTO {
    @NotNull(message = "Debe especificarse un forumType válido [ANNOUNCE, GENERAL].")
    private ForumType forumType;
    @NotNull(message = "Debe especificarse un courseId.")
    private Integer courseId;

    private String rootPost;
}
