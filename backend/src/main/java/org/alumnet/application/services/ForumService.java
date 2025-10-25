package org.alumnet.application.services;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.PostDTO;
import org.alumnet.application.dtos.requests.PostFilterDTO;
import org.alumnet.application.mapper.PostMapper;
import org.alumnet.application.query_builders.PostQueryBuilder;
import org.alumnet.domain.forums.Post;
import org.alumnet.domain.repositories.ForumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForumService {
    private final ForumRepository forumRepository;
    private final PostMapper postMapper;
    private final MongoTemplate mongoTemplate;

    public Page<PostDTO> getPosts(PostFilterDTO postFilter, Pageable page){
        Query query = PostQueryBuilder.byFilters(postFilter).with(page);

        List<Post> posts = mongoTemplate.find(query, Post.class);
        long total = mongoTemplate.count(query, Post.class);

        return new PageImpl<>(buildHierarchy(posts, postFilter.getRootPost()), page, total);
    }

    private List<PostDTO> buildHierarchy(List<Post> posts, String rootPostId){
        Map<String, PostDTO> postsById = posts.stream()
                .map(postMapper::postToPostDTO)
                .collect(Collectors.toMap(PostDTO::getId, post -> post));

        postsById.values().forEach(postDto -> {
            // En un post de respuesta, parentPost contiene el ID del post padre.
            String parentId = postDto.getParentPost();

            if (parentId != null && postsById.containsKey(parentId)) {
                PostDTO parent = postsById.get(parentId);

                if (parent.getResponses() == null) {
                    parent.setResponses(new ArrayList<>());
                }

                parent.getResponses().add(postDto);
            }
        });

        return postsById.values().stream()
                .filter(postDto -> postDto.getParentPost() == rootPostId)
                .collect(Collectors.toList());
    }
}
