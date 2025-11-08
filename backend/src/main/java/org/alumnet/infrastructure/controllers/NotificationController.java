package org.alumnet.infrastructure.controllers;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.StudentSubmissionDTO;
import org.alumnet.application.dtos.requests.GradeSubmissionsRequestDTO;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<ResultResponse<Object>> sendNotification(@RequestBody GradeSubmissionsRequestDTO request) {

        notificationService.sendGradeNotifications(request);
        return ResponseEntity.ok(ResultResponse.success(null, "Notificaciones enviadas exitosamente"));
    }

}
