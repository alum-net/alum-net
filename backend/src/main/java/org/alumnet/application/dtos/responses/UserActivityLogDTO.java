package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.ActivityType;

import java.time.LocalDateTime;

@Data
@Builder
public class UserActivityLogDTO {
    private Long id;
    private String userEmail;
    private ActivityType type;
    private String description;
    private String resourceId;
    private LocalDateTime timestamp;
}