package org.alumnet.application.mapper;

import javax.annotation.processing.Generated;
import org.alumnet.application.dtos.PostDTO;
import org.alumnet.domain.forums.Post;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-27T16:22:45-0300",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Override
    public PostDTO postToPostDTO(Post post) {
        if ( post == null ) {
            return null;
        }

        PostDTO postDTO = new PostDTO();

        postDTO.setAuthor( post.getAuthor() );
        postDTO.setContent( post.getContent() );
        postDTO.setCourseId( post.getCourseId() );
        postDTO.setCreatedAt( post.getCreatedAt() );
        postDTO.setId( post.getId() );
        postDTO.setParentPost( post.getParentPost() );
        postDTO.setRootPost( post.getRootPost() );
        postDTO.setTitle( post.getTitle() );
        postDTO.setTotalResponses( post.getTotalResponses() );
        postDTO.setUpdatedAt( post.getUpdatedAt() );

        return postDTO;
    }
}
