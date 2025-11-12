package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.NotificationType;

@Data
@Builder
public class WebNotificationDTO {
    private NotificationType type;
    private String title;
    private String message;
}
