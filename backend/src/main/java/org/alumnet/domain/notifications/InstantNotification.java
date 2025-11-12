package org.alumnet.domain.notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.alumnet.application.enums.NotificationStatus;
import org.alumnet.application.enums.NotificationType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "instant_notifications")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstantNotification {
    @Id
    private String id;
    @Field("title")
    private String title;
    @Field("message")
    private String message;
    @Field("recipient_id")
    @Indexed
    private String recipientId;
    @Field("web_status")
    @Indexed
    private NotificationStatus webStatus;
    @Field("type")
    private NotificationType type;

    public void markAsWebViewed() {
        this.webStatus = NotificationStatus.SENT;
    }
}
