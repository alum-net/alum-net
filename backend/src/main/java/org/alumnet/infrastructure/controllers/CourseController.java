package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.CourseCreationRequestDTO;
import org.alumnet.application.dtos.EnrollmentRequestDTO;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Void>> create(@Valid @RequestBody CourseCreationRequestDTO courseDTO) {
        courseService.create(courseDTO);
        ResultResponse<Void> resultResponse = ResultResponse.<Void>builder()
                .success(true)
                .message("Curso creado correctamente")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resultResponse);
    }

    @PostMapping("/{courseId}/participations")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Void>> addMember(
            @PathVariable int courseId,
            @Valid @RequestBody EnrollmentRequestDTO enrollmentRequest) {
        courseService.addMemberToCourse(courseId, enrollmentRequest.getStudentEmail());
        ResultResponse<Void> response = ResultResponse.<Void>builder()
                .success(true)
                .message("Estudiante matriculado correctamente")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


}

