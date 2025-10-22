package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.SectionCreationRequestDTO;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.SectionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
@RequiredArgsConstructor
public class SectionController {


    private final SectionService sectionService;

    @PostMapping (path = "/{courseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> createSection(@RequestPart("section") @Valid SectionCreationRequestDTO sectionDTO,
                                        @RequestPart (value = "resources", required = false) List<MultipartFile> files,
                                        @PathVariable int courseId) {
        sectionService.createSection(sectionDTO, files, courseId);
        return ResponseEntity.ok().body(ResultResponse.success("Sección creada exitosamente", null));
    }
}
