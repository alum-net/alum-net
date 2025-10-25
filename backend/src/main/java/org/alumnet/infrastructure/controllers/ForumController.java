package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.PostDTO;
import org.alumnet.application.dtos.requests.PostCreationRequestDTO;
import org.alumnet.application.dtos.requests.PostFilterDTO;
import org.alumnet.application.dtos.requests.UpdatePostRequestDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.ForumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forums")
@RequiredArgsConstructor
public class ForumController {
    private final ForumService forumService;

    @GetMapping(path = "/posts", produces = "application/json")
    @PreAuthorize("hasAnyRole('teacher', 'student','admin')")
    public ResponseEntity<PageableResultResponse<PostDTO>> getPosts(
            @PageableDefault(page = 0, size = 15) Pageable page,
            @Valid PostFilterDTO postFilter){

        Page<PostDTO> postPage = forumService.getPosts(postFilter, page);

        PageableResultResponse<PostDTO> response = PageableResultResponse.fromPage(
                postPage,
                postPage.getContent(),
                postPage.getTotalElements() > 0
                        ? "Posts obtenidos exitosamente"
                        : "No se encontraron posts");

        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/posts", produces = "application/json")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<Object>> createPost(
            @Valid @RequestBody PostCreationRequestDTO post){

        forumService.createPost(post);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResultResponse.success(null, "Se creó el post correctamente"));
    }

    @DeleteMapping(path = "/posts/{postId}", produces = "application/json")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<Object>> deletePost(
            @PathVariable String postId){

        forumService.deletePost(postId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ResultResponse.success(null, "Se eliminó el post correctamente"));
    }

    @PatchMapping(path = "/posts/{postId}", produces = "application/json")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<Object>> updatePost(
            @RequestBody UpdatePostRequestDTO postContent,
            @PathVariable String postId){

        forumService.updatePost(postId, postContent);

        return ResponseEntity.ok()
                .body(ResultResponse.success(null, "Se modificó el post correctamente"));
    }
}
