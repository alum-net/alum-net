package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.PostDTO;
import org.alumnet.application.dtos.requests.PostFilterDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.enums.ForumType;
import org.alumnet.application.services.ForumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
