package org.alumnet.application.mapper;

import org.alumnet.application.dtos.PostDTO;
import org.alumnet.domain.forums.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {

    PostDTO postToPostDTO(Post post);
}
