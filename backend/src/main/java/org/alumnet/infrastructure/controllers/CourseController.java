package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.CourseDTO;
import org.alumnet.application.services.CourseService;
import org.alumnet.domain.Course;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.Serializable;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Map<String, Serializable>> create(@Valid @RequestBody CourseDTO courseDTO) {
        Course created = courseService.create(courseDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message","Curso creado correctamente","id", created.getId()));
    }
}
