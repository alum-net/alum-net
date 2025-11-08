package org.alumnet.application.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.alumnet.application.dtos.StudentSubmissionDTO;
import org.alumnet.application.dtos.requests.GradeSubmissionsRequestDTO;
import org.alumnet.application.enums.GradeContextType;
import org.alumnet.application.enums.NotificationStatus;
import org.alumnet.application.query_builders.NotificationQueryBuilder;
import org.alumnet.domain.ScheduledNotification;
import org.alumnet.domain.repositories.NotificationRepository;
import org.alumnet.infrastructure.config.OneSignalClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final OneSignalClient oneSignalClient;
    private final NotificationRepository notificationRepository;
    private final MongoTemplate mongoTemplate;

    @Value("${send.notification.now:false}")
    private boolean sendNotificationNow;

    /**
     * Cancels a scheduled notification in both the local database and OneSignal.
     */
    public void cancelScheduledNotification(int eventId, String notificationId) {
        Query query = NotificationQueryBuilder.byEventId(eventId);
        ScheduledNotification notification = mongoTemplate.findOne(query, ScheduledNotification.class);

        if (notification == null) {
            log.warn("No scheduled notification found for event {}", eventId);
            return;
        }

        notificationRepository.delete(notification);

        try {
            oneSignalClient.cancelNotification(notificationId);
            log.info("Notification {} canceled successfully in OneSignal", notificationId);
        } catch (Exception e) {
            log.error("Error canceling OneSignal notification: {}", e.getMessage(), e);
            throw new RuntimeException("Error communicating with OneSignal", e);
        }
    }
    public void sendGradeNotifications(GradeSubmissionsRequestDTO request) {
        boolean isCourse = request.getCourseId() != null;
        Integer targetId = isCourse ? request.getCourseId() : request.getEventId();
        String context = isCourse ? GradeContextType.COURSE.getValue() : GradeContextType.EVENT.getValue();

        List<String> emails = request.getStudents().stream()
                .map(StudentSubmissionDTO::getEmail)
                .toList();

        String title = "Calificaciones publicadas";
        String message = String.format(
                "Las calificaciones del %s han sido publicadas.",
                context
        );

        sendNotifications(targetId, title, message, emails, LocalDateTime.now(),context);
    }


    /**
     * Creates and sends a notification (immediate or scheduled).
     */
    public String sendNotifications(int eventId, String title, String message, List<String> userEmails,
            LocalDateTime endDate, String notificationType) {
        ScheduledNotification scheduledNotification = null;
        try {
            scheduledNotification = saveScheduledEmailNotification(eventId, title, message, userEmails, endDate,notificationType);
            return sendPushNotifications(title, message, userEmails, endDate);
        } catch (Exception e) {
            log.error("Error sending notification: {}", e.getMessage(), e);
            if (scheduledNotification != null) {
                notificationRepository.deleteById(scheduledNotification.getId());
            }
            throw new RuntimeException("Error communicating with OneSignal", e);
        }
    }

    /**
     * Builds the OneSignal payload and sends it through the client.
     *
     * @throws JsonProcessingException
     */
    private String sendPushNotifications(String title, String message, List<String> userEmails, LocalDateTime endDate)
            throws JsonProcessingException {
        log.info("Preparing to send notification to {} users: {} - {}", userEmails.size(), title, message);
        log.debug("sendNotificationNow: {}", sendNotificationNow);

        LocalDateTime scheduledSend = null;

        // Only schedule if "send now" is false and event is >24h away
        if (!sendNotificationNow && endDate.minusHours(24).isAfter(LocalDateTime.now())) {
            scheduledSend = endDate.minusHours(24);
        }

        return oneSignalClient.sendNotification(title, message, userEmails, scheduledSend);
    }

    /**
     * Saves a notification record in DB before it's sent or scheduled.
     */
    private ScheduledNotification saveScheduledEmailNotification(int eventId, String title, String message,
            List<String> userEmails, LocalDateTime endDate, String notificationType) {
        LocalDateTime scheduledTime = endDate.minusHours(24);
        if (scheduledTime.isBefore(LocalDateTime.now())) {
            scheduledTime = LocalDateTime.now(); // send immediately if <24h left
        }

        ScheduledNotification notification = ScheduledNotification.builder()
                .title(title)
                .eventId(eventId)
                .message(message)
                .notificationType(notificationType)
                .recipientIds(userEmails)
                .state(NotificationStatus.PENDING)
                .scheduledSendTime(scheduledTime)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Returns pending notifications that should be processed.
     */
    public List<ScheduledNotification> processPendingNotifications() {
        return notificationRepository.findByStateAndScheduledSendTimeBefore(
                NotificationStatus.PENDING, LocalDateTime.now());
    }

    /**
     * Marks a notification as sent after successful delivery.
     */
    public void markNotificationAsSent(ScheduledNotification notification) {
        notification.markAsSent();
        notificationRepository.save(notification);
    }
}
