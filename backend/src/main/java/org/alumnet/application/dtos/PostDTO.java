package org.alumnet.application.dtos;

import lombok.Data;
import org.alumnet.domain.forums.Author;

import java.util.Date;
import java.util.List;

@Data
public class PostDTO {
    private String id;
    private Integer courseId;
    private String title;
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private Boolean enabled;
    private String parentPost;
    private String rootPost;
    private Author author;
    private Integer totalResponses;
    private List<PostDTO> responses;
}
