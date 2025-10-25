package org.alumnet.application.dtos.requests;

import lombok.Data;
import org.alumnet.application.enums.ForumType;
import org.alumnet.domain.forums.Author;

@Data
public class PostCreationRequestDTO {
    private ForumType forumType;
    private Integer courseId;
    private String title;
    private String content;
    private String parentPost;
    private String rootPost;
    private Author author;
}
