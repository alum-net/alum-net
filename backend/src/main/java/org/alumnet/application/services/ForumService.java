package org.alumnet.application.services;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.PostDTO;
import org.alumnet.application.dtos.requests.PostCreationRequestDTO;
import org.alumnet.application.dtos.requests.PostFilterDTO;
import org.alumnet.application.dtos.requests.UpdatePostRequestDTO;
import org.alumnet.application.mapper.PostMapper;
import org.alumnet.application.query_builders.PostQueryBuilder;
import org.alumnet.domain.forums.Post;
import org.alumnet.domain.repositories.ForumRepository;
import org.alumnet.infrastructure.exceptions.InvalidPostContentLenghtException;
import org.alumnet.infrastructure.exceptions.InvalidPostTitleException;
import org.alumnet.infrastructure.exceptions.PostHasRepliesException;
import org.alumnet.infrastructure.exceptions.PostNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
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

        return new PageImpl<>(buildHierarchy(posts), page, total);
    }

    public void createPost(PostCreationRequestDTO post) {
        validatePostCharacterLength(post.getContent());
        validateTitle(post);
        
        Post newPost = Post.builder()
                .title(post.getTitle())
                .author(post.getAuthor())
                .content(post.getContent())
                .parentPost(post.getParentPost())
                .rootPost(post.getRootPost())
                .courseId(post.getCourseId())
                .forumName(post.getForumType().getValue())
                .totalResponses(0)
                .enabled(true)
                .createdAt(new Date())
                .updatedAt(null)
                .build();

        forumRepository.save(newPost);

        if(post.getParentPost() != null){
            Post parentPost = forumRepository.findById(post.getParentPost()).orElseThrow(PostNotFoundException::new);

            parentPost.setTotalResponses(parentPost.getTotalResponses()+1);

            forumRepository.save(parentPost);
        }
    }

    public void deletePost(String postId) {
        Post post = forumRepository.findById(postId).orElseThrow(PostNotFoundException::new);

        if(post.getParentPost() != null){
            Post parentPost = forumRepository.findById(post.getParentPost()).orElseThrow(PostNotFoundException::new);
            parentPost.setTotalResponses(parentPost.getTotalResponses() -1);

            forumRepository.save(parentPost);
        }

        post.setEnabled(false);
        forumRepository.save(post);
    }

    public void updatePost(String postId, UpdatePostRequestDTO postContent) {
        validatePostCharacterLength(postContent.getMessage());

        Post post = forumRepository.findById(postId).orElseThrow(PostNotFoundException::new);

        if(post.getTotalResponses() > 0) throw new PostHasRepliesException();

        if(postContent.getMessage() != null){
            post.setContent(postContent.getMessage());
        }

        if(postContent.getTitle() != null && post.getParentPost() == null){
            post.setTitle(postContent.getTitle());
        }

        forumRepository.save(post);
    }

    private void validateTitle(PostCreationRequestDTO post) {
        if(post.getTitle() != null && post.getParentPost() != null){
            throw new InvalidPostTitleException();
        }
    }

    private void validatePostCharacterLength(String content) {
        if(content.length() > 350) throw new InvalidPostContentLenghtException();
    }

    private List<PostDTO> buildHierarchy(List<Post> posts) {
        if (posts == null || posts.isEmpty()) {
            return List.of();
        }

        Map<String, PostDTO> postsById = posts.stream()
                .map(postMapper::postToPostDTO)
                .collect(Collectors.toMap(PostDTO::getId, post -> post));

        postsById.values().forEach(postDto -> {
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
                .filter(postDto -> postDto.getParentPost() == null)
                .collect(Collectors.toList());
    }
}
