package org.alumnet.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.LabelDTO;
import org.alumnet.application.dtos.LibraryResourceDTO;
import org.alumnet.application.dtos.requests.LibraryResourceCreationRequestDTO;
import org.alumnet.application.dtos.requests.LibraryResourceFilterDTO;
import org.alumnet.application.dtos.requests.UpdateLabelRequestDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.LibraryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        return ResponseEntity.status(HttpStatus.CREATED).body(ResultResponse.success(newLabel, "Etiqueta creada exitosamente"));
    }

    @DeleteMapping(path = "/labels/{labelId}", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> deleteLabel(
            @PathVariable int labelId) {
        libraryService.deleteLabel(labelId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ResultResponse.success(null, "Etiqueta eliminada exitosamente"));
    }

    @GetMapping(path = "/resources", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    public ResponseEntity<PageableResultResponse<LibraryResourceDTO>> getResources(
            @PageableDefault(page = 0, size = 15) Pageable page,
            LibraryResourceFilterDTO filter) {

        Page<LibraryResourceDTO> resourcePage = libraryService.getResources(filter, page);

        PageableResultResponse<LibraryResourceDTO> response = PageableResultResponse.fromPage(
                resourcePage,
                resourcePage.getContent(),
                resourcePage.getTotalElements() > 0
                        ? "Recursos obtenidos exitosamente"
                        : "No se encontraron recursos que coincidan con los filtros");


        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/resources", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<ResultResponse<Object>> createResource(
            @RequestPart(value = "file", required = true) MultipartFile file,
            @RequestPart(value = "metadata", required = true) LibraryResourceCreationRequestDTO metadata){
        libraryService.createResource(file, metadata);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResultResponse.success(null, "Se creó el recurso correctamente"));
    }

    @DeleteMapping(path= "/resources/{resourceId}", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<ResultResponse<Object>> deleteResource(
            @PathVariable Integer resourceId){
        libraryService.deleteResource(resourceId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ResultResponse.success(null, "Se eliminó el recurso correctamente"));
    }

    @PutMapping(path = "/labels/{labelId}", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> deleteLabel(
            @PathVariable int labelId,
            @RequestBody UpdateLabelRequestDTO label) {
        libraryService.modifyLabel(labelId, label.getName());
        return ResponseEntity.ok(ResultResponse.success(null, "Etiqueta modificada exitosamente"));
    }
}
