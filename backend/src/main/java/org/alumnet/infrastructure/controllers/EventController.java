package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.requests.GradeSubmissionsRequestDTO;
import org.alumnet.application.dtos.requests.SubmitQuestionnaireRequestDTO;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping(value = "/create", produces = "application/json")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> createEvent(@RequestBody @Valid EventDTO eventDTO) {
        eventService.createEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResultResponse.success(null, "Evento creado exitosamente"));
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<EventDTO>> getEventById(@PathVariable Integer eventId) {
        EventDTO eventDTO = eventService.getEventById(eventId);
        return ResponseEntity.ok(ResultResponse.success(eventDTO, "Tarea obtenida exitosamente"));
    }

    @PostMapping("/{eventId}/submit-homework")
    @PreAuthorize("hasRole('student')")
    public ResponseEntity<ResultResponse<Object>> submitHomework(@PathVariable Integer eventId,
            @RequestParam String studentEmail,
            @RequestPart("homeworkFile") MultipartFile homeworkFile) {
        eventService.submitHomework(eventId, homeworkFile, studentEmail);
        return ResponseEntity.ok(ResultResponse.success(null, "Tarea enviada exitosamente"));
    }

    @DeleteMapping(value = "/{eventId}", produces = "application/json")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> deleteEvent(@PathVariable(required = true) int eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(ResultResponse.success(null, "Evento eliminado exitosamente"));
    }

    @GetMapping(value = "/{eventId}/details", produces = "application/json")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<EventDTO>> getQuestionnaireDetailsById(
            @PathVariable Integer eventId,
            String userEmail) {
        EventDTO questionnaire = eventService.getQuestionnaireDetails(eventId, userEmail);
        return ResponseEntity.ok(ResultResponse.success(questionnaire, "Cuestionario obtenido exitosamente"));
    }

    @PostMapping(value = "/{eventId}/submit", produces = "application/json")
    @PreAuthorize("hasAnyRole('student')")
    public ResponseEntity<ResultResponse<Object>> submitQuestionnaireResponses(
            @PathVariable Integer eventId,
            @RequestBody SubmitQuestionnaireRequestDTO request) {
        eventService.submitQuestionnaireResponses(request, eventId);
        return ResponseEntity.ok(ResultResponse.success(null, "Se guardaron las respuestas exitosamente"));
    }

    @GetMapping(value = "/course/{courseId}", produces = "application/json")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> getUnratedEventsByCourseId(@PathVariable Integer courseId) {
        return ResponseEntity.ok(ResultResponse.success(eventService.getUnratedEventsByCourseId(courseId), "Eventos sin calificar obtenidos exitosamente"));
    }

    @GetMapping(value = "/{eventId}/students", produces = "application/json")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> getEventStudents(@PathVariable Integer eventId) {
        return ResponseEntity.ok(ResultResponse.success(eventService.getEventStudents(eventId), "Libro de calificaciones obtenido exitosamente"));
    }

    @PostMapping(value = "/grade-submissions", produces = "application/json")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> gradeSubmissions(@RequestBody GradeSubmissionsRequestDTO request) {
        eventService.gradeSubmissions(request);
        return ResponseEntity.ok(ResultResponse.success(null, "Calificaciones guardadas exitosamente"));
    }


}
