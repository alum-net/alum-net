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
    public ResponseEntity<ResultResponse<Object>> create(@Valid @RequestBody CourseCreationRequestDTO courseDTO) {
        courseService.create(courseDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResultResponse.success(null, "Curso creado correctamente"));
    }

    @PostMapping("/{courseId}/participations")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> addMember(
            @PathVariable int courseId,
            @Valid @RequestBody EnrollmentRequestDTO enrollmentRequest) {
        courseService.addMemberToCourse(courseId, enrollmentRequest.getStudentEmail());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResultResponse.success(null, "Estudiante matriculado correctamente"));
    }


    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> deleteCourse(@PathVariable int courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ResultResponse.success(null, "Curso eliminado correctamente"));
    }

    @DeleteMapping("/{courseId}/participations/{userEmail}")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> removeMemberFromCourse(@PathVariable Integer courseId, @PathVariable String userEmail) {
        courseService.removeMemberFromCourse(courseId, userEmail);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ResultResponse
                        .success(null, String.format("Se desmatriculó al usuario %s del curso id %s", userEmail, courseId)));
    }

}

