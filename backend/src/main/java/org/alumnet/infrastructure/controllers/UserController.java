package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.requests.UserCreationRequestDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.requests.UserFilterDTO;
import org.alumnet.application.dtos.requests.UserModifyRequestDTO;
import org.alumnet.application.dtos.responses.BulkResponseDTO;
import org.alumnet.application.dtos.responses.CalendarEventDetailDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.dtos.responses.UserActivityLogDTO;
import org.alumnet.application.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @PostMapping(path = "/create-user", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> createUser(
            @Valid @RequestBody UserCreationRequestDTO userCreationRequestDTO) {
        userService.createUser(userCreationRequestDTO);
        return ResponseEntity.ok(ResultResponse.success(null, "Usuario creado exitosamente"));
    }

    @GetMapping(path = "/{userEmail}", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    public ResponseEntity<ResultResponse<UserDTO>> getUser(@PathVariable String userEmail) {
        UserDTO user = userService.getUser(userEmail);
        return ResponseEntity.ok(ResultResponse.success(user, "Usuario encontrado."));
    }

    @GetMapping(path = "/", produces = "application/json")
    @PreAuthorize("hasRole('admin' )")
    public ResponseEntity<PageableResultResponse<UserDTO>> getUsers(
            @PageableDefault(page = 0, size = 15) Pageable page,
            UserFilterDTO filter) {
        Page<UserDTO> userPage = userService.getUsers(filter, page);

        PageableResultResponse<UserDTO> response = PageableResultResponse.fromPage(
                userPage,
                userPage.getContent(),
                userPage.getTotalElements() > 0
                        ? "Usuarios obtenidos exitosamente"
                        : "No se encontraron usuarios que coincidan con los filtros");

        return ResponseEntity.ok(response);

    }

    @PatchMapping(path = "/{userEmail}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    public ResponseEntity<ResultResponse<UserDTO>> modifyUser(
            @PathVariable String userEmail,
            @RequestPart(value = "userAvatar", required = false) MultipartFile userAvatar,
            @RequestPart(value = "modifyRequest", required = false) UserModifyRequestDTO modifyRequest) {
        userService.modifyUser(userEmail, modifyRequest, userAvatar);
        return ResponseEntity.ok(ResultResponse.success(userService.getUser(userEmail),
                "Usuario modificado correctamente."));
    }

    @PostMapping(path = "/bulk-creation", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> bulkCreateUsers(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "hasHeaders", required = false, defaultValue = "false") boolean hasHeaders) {
        BulkResponseDTO bulkCreationResponse = userService.bulkCreateUsers(file, hasHeaders);

        if (bulkCreationResponse.getTotalRecords() == bulkCreationResponse.getErrors().size()) {
            return ResponseEntity.badRequest().body(ResultResponse.success(
                    bulkCreationResponse,
                    "La solicitud de creación masiva de usuarios no se pudo procesar."));
        }

        return ResponseEntity.ok(ResultResponse.success(
                bulkCreationResponse,
                "Solicitud de creación masiva de usuarios procesada exitosamente."));
    }

    @GetMapping(path = "/calendar-events", produces = "application/json")
    @PreAuthorize("hasAnyRole('teacher', 'student')")
    public ResponseEntity<ResultResponse<List<CalendarEventDetailDTO>>> getCalendarEvents(Principal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        List<CalendarEventDetailDTO> events = userService.getCalendarEvents(since, to, principal.getName());

        return ResponseEntity.ok(ResultResponse.success(events, "Se devuelven los eventos asociados"));
    }

    @GetMapping(path = "/{userId}/user-activity", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin')")
    public ResponseEntity<PageableResultResponse<UserActivityLogDTO>> getUserActivity(
            @PathVariable String userId,
            @PageableDefault(page = 0, size = 15) Pageable page) {
        Page<UserActivityLogDTO> logs = userService.getUserLogs(userId, page);

        PageableResultResponse<UserActivityLogDTO> response = PageableResultResponse.fromPage(
                logs,
                logs.getContent(),
                logs.getTotalElements() > 0
                        ? "Registros de actividad obtenidos exitosamente"
                        : "No se encontraron registros de actividad para el usuario");

        return ResponseEntity.ok(response);
    }
}
