package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.EventType;

import java.time.LocalDateTime;

@Data
@Builder
public class CalendarEventDetailDTO {
    private Integer courseId;
    private String courseName;
    private Integer eventId;
    private EventType type;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
