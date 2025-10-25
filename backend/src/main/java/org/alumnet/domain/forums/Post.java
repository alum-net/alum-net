package org.alumnet.domain.forums;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "posts")
@Getter
@Setter
@Builder
public class Post {

    @Id
    private String id;

    private String forumName;

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
}