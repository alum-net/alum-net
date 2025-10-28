package org.alumnet.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.LabelDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.LibraryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {
    private final LibraryService libraryService;

    @GetMapping(path = "/labels", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<PageableResultResponse<LabelDTO>> getLabels(
            @PageableDefault(page = 0, size = 15) Pageable page,
            String textToSearch) {
        Page<LabelDTO> labels = libraryService.getLabel(textToSearch, page);

        PageableResultResponse<LabelDTO> response = PageableResultResponse.fromPage(
                labels,
                labels.getContent(),
                labels.getTotalElements() > 0
                        ? "Etiquetas obtenidos exitosamente"
                        : "No se encontraron etiquetas que coincidan con los filtros");

        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/labels", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<ResultResponse<LabelDTO>> createLabel(
           @RequestBody String label) {
        LabelDTO newLabel =  libraryService.createLabel(label);
        return ResponseEntity.ok(ResultResponse.success(newLabel, "Etiqueta creada exitosamente"));
    }
}
