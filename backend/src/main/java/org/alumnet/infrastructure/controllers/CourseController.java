package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.*;
import org.alumnet.application.dtos.requests.CourseCreationRequestDTO;
import org.alumnet.application.dtos.requests.CourseFilterDTO;
import org.alumnet.application.dtos.requests.EnrollmentRequestDTO;
import org.alumnet.application.dtos.responses.BulkResponseDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.CourseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

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
        public ResponseEntity<ResultResponse<Object>> removeMemberFromCourse(@PathVariable Integer courseId,
                        @PathVariable String userEmail) {
                courseService.removeMemberFromCourse(courseId, userEmail);
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                                .body(ResultResponse
                                                .success(null, String.format(
                                                                "Se desmatriculó al usuario %s del curso id %s",
                                                                userEmail, courseId)));
        }

        @GetMapping(path = "/", produces = "application/json")
        @PreAuthorize("hasAnyRole('teacher', 'student','admin')")
        public ResponseEntity<PageableResultResponse<CourseDTO>> getCourses(
                        CourseFilterDTO filter,
                        @PageableDefault(page = 0, size = 15) Pageable page) {
                                
                Page<CourseDTO> coursePage = courseService.getCourses(filter, page);
                                
                PageableResultResponse<CourseDTO> response = PageableResultResponse.fromPage(
                                coursePage,
                                coursePage.getContent(),
                                coursePage.getTotalElements() > 0
                                                ? "Cursos obtenidos exitosamente"
                                                : "No se encontraron cursos que coincidan con los filtros");

                return ResponseEntity.ok(response);
        }

        @GetMapping(path = "/{courseId}/members", produces = "application/json")
        @PreAuthorize("hasAnyRole('admin','teacher')")
        public ResponseEntity<PageableResultResponse<UserDTO>> getCourseMembers(
                        @PageableDefault(page = 0, size = 15) Pageable page,
                        @PathVariable int courseId) {

                Page<UserDTO> userPage = courseService.getCourseMembers(courseId, page);

                PageableResultResponse<UserDTO> response = PageableResultResponse.fromPage(
                                userPage,
                                userPage.getContent(),
                                "Miembros obtenidos exitosamente");

                return ResponseEntity.ok(response);
        }

    @GetMapping("/{courseId}/content/")
    @PreAuthorize("hasAnyRole('teacher', 'student','admin')")
    public ResponseEntity<ResultResponse<CourseContentDTO>> getCourseContent(@PageableDefault (page = 0, size = 5) Pageable page,
                                                                   @PathVariable Integer courseId,
                                                                   @RequestParam String userId) {

        CourseContentDTO userPage = courseService.getCourseContent(page,courseId,userId);
        return ResponseEntity.ok(ResultResponse.success(userPage,"Secciones obtenidas exitosamente"));

    }

    @PostMapping(path = "/bulk-creation",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<BulkResponseDTO>> bulkCreateCourses(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "hasHeaders", required = false, defaultValue = "false") boolean hasHeaders) {

        BulkResponseDTO bulkCreationResponse = courseService.bulkCreateCourses(file, hasHeaders);

        if (bulkCreationResponse.getTotalRecords() > 0 &&
                bulkCreationResponse.getTotalRecords() == bulkCreationResponse.getFailedRecords()) {

            return ResponseEntity.badRequest().body(ResultResponse.success(
                    bulkCreationResponse,
                    "La solicitud de creación masiva de cursos no se pudo procesar completamente (todos los registros fallaron)."));
        }

        String successMessage = bulkCreationResponse.getFailedRecords() == 0
                ? "Carga masiva de cursos completada exitosamente."
                : "Carga masiva finalizada con " + bulkCreationResponse.getFailedRecords() + " errores. Revise el reporte.";

        return ResponseEntity.ok(ResultResponse.success(
                bulkCreationResponse,
                successMessage));
    }

    @DeleteMapping(path = "/bulk-deletion",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> bulkDeletion(
            @RequestPart(value = "file", required = true) MultipartFile file,
            @RequestParam(value = "hasHeaders", required = false, defaultValue = "false") boolean hasHeaders){

        BulkResponseDTO bulkDeletionResponse = courseService.bulkDeleteCourses(file, hasHeaders);

        if(bulkDeletionResponse.getFailedRecords() == bulkDeletionResponse.getTotalRecords()){
            return ResponseEntity.badRequest().body(ResultResponse
                    .error(bulkDeletionResponse
                            .getErrors().stream()
                                    .map(error ->
                                            "Linea " + error.getLineNumber() + ": " + error.getReason())
                                    .collect(Collectors.toList()),
                            "La solicitud de baja masiva de cursos no se pudo completar"));
        }

        String successMessage = bulkDeletionResponse.getFailedRecords() == 0
                ? "Eliminación masiva de cursos completada exitosamente."
                : "Eliminación masiva finalizada con " + bulkDeletionResponse.getFailedRecords() + " errores. Revise el reporte.";

        // Va en ok en lugar de no content para que viaje la response
        return ResponseEntity.ok(ResultResponse.success(bulkDeletionResponse, successMessage));
    }

    @PostMapping(path = "/{courseId}/participations/bulk-enroll",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<BulkResponseDTO>> bulkEnrollStudents(
            @PathVariable int courseId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "hasHeaders", required = false, defaultValue = "false") boolean hasHeaders){

        BulkResponseDTO bulkEnrollResponse = courseService.bulkEnrollment(courseId, file, hasHeaders);

        if(bulkEnrollResponse.getFailedRecords() == bulkEnrollResponse.getTotalRecords()){
            return ResponseEntity.badRequest().body(ResultResponse
                    .error(bulkEnrollResponse
                                    .getErrors().stream()
                                    .map(error ->
                                            "Linea " + error.getLineNumber() + ": " + error.getReason())
                                    .collect(Collectors.toList()),
                            "La solicitud de matriculación masiva no se pudo completar"));
        }

        String successMessage = bulkEnrollResponse.getFailedRecords() == 0
                ? "Matriculación masiva de cursos completada exitosamente."
                : "Matriculación masiva finalizada con " + bulkEnrollResponse.getFailedRecords() + " errores. Revise el reporte.";

        return ResponseEntity.ok(ResultResponse.success(bulkEnrollResponse ,successMessage));
    }

    @DeleteMapping(path = "/{courseId}/participations/bulk-unenroll",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<BulkResponseDTO>> bulkUnenrollStudents(
            @PathVariable int courseId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "hasHeaders", required = false, defaultValue = "false") boolean hasHeaders) {

        BulkResponseDTO bulkResponse = courseService.bulkUnenrollment(courseId, file, hasHeaders);

        if (bulkResponse.getTotalRecords() > 0 &&
                bulkResponse.getTotalRecords() == bulkResponse.getFailedRecords()) {

            return ResponseEntity.badRequest().body(ResultResponse.success(
                    bulkResponse,
                    "La solicitud de des-matriculación masiva no se pudo procesar completamente (todos los registros fallaron)."));
        }

        String successMessage = bulkResponse.getFailedRecords() == 0
                ? "Des-matriculación masiva completada exitosamente."
                : "Des-matriculación masiva finalizada con " + bulkResponse.getFailedRecords() + " errores. Revise el reporte.";

        // Va en ok en lugar de no content para que viaje la response
        return ResponseEntity.ok(ResultResponse.success(
                bulkResponse,
                successMessage));
    }
}
