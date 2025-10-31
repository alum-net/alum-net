package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping(value = "/create", produces = "application/json")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> createEvent(@RequestBody @Valid EventDTO eventDTO) {
        eventService.createEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResultResponse.success(null, "Tarea creada exitosamente"));
    }
}
