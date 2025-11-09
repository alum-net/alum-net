package org.alumnet.domain.notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.enums.NotificationStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "scheduled_notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledNotification {
    @Id
    private String id;
    @Field("title")
    private String title;
    @Field("message")
    private String message;
    @Field("state")
    @Indexed
    private NotificationStatus state;
    @Field("eventId")
    @Indexed
    private Integer eventId;
    @Field("recipient_ids")
    private List<String> recipientIds;
    @Field("sent_at")
    private LocalDateTime sentAt;
    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
    @Field("scheduled_send_time")
    private LocalDateTime scheduledSendTime;

    public void markAsSent() {
        this.state = NotificationStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }

}
