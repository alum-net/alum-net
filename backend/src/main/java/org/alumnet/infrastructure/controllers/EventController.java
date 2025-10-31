package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping(value = "/{eventId}", produces = "application/json")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> deleteEvent(@PathVariable(required = true) int eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ResultResponse.success(null, "Tarea eliminada exitosamente"));
    }
}
