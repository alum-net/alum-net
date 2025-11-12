package org.alumnet.application.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mailgun.api.v3.MailgunMessagesApi;
import com.mailgun.model.message.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.alumnet.application.dtos.StudentSubmissionDTO;
import org.alumnet.application.dtos.requests.GradeSubmissionsRequestDTO;
import org.alumnet.application.dtos.responses.WebNotificationDTO;
import org.alumnet.application.enums.GradeContextType;
import org.alumnet.application.enums.NotificationStatus;
import org.alumnet.application.enums.NotificationType;
import org.alumnet.application.query_builders.NotificationQueryBuilder;
import org.alumnet.domain.notifications.InstantNotification;
import org.alumnet.domain.notifications.ScheduledNotification;
import org.alumnet.domain.repositories.InstantNotificationRepository;
import org.alumnet.domain.repositories.NotificationRepository;
import org.alumnet.infrastructure.config.OneSignalClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final OneSignalClient oneSignalClient;
    private final NotificationRepository notificationRepository;
    private final InstantNotificationRepository instantNotificationRepository;
    private final MongoTemplate mongoTemplate;

    private final MailgunMessagesApi mailgunMessagesApi;
    @Value("${mailgun.domain}")
    private String DOMAIN;

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

    public void sendInstantNotifications(String title, String message, Set<String> userEmailsToNotify, NotificationType type) {
        for(String userEmail : userEmailsToNotify){
            sendInstantNotificationWithOneSignal(title, message, userEmail);
            sendInstantNotificationWithMail(title, message, userEmail);

            InstantNotification notification = InstantNotification
                    .builder()
                    .recipientId(userEmail)
                    .webStatus(NotificationStatus.PENDING)
                    .title(title)
                    .message(message)
                    .type(type)
                    .build();

            instantNotificationRepository.save(notification);
        }

    }

    private void sendInstantNotificationWithMail(String title, String message, String userEmail) {

        try{
            Message mailMessage = Message.builder().from("noreply@alumnet-uy.org")
                    .to(Collections.singletonList(userEmail))
                    .subject(title)
                    .text(message).build();
            mailgunMessagesApi.sendMessage(DOMAIN, mailMessage);
        }
        catch (Exception e) {
            log.error("Error sending notification: {}", e.getMessage(), e);
        }
    }

    private void sendInstantNotificationWithOneSignal(String title, String message, String userEmail){
        try {
            oneSignalClient.sendNotification(title, message, Collections.singletonList(userEmail), null);
        } catch (Exception e) {
            log.error("Error sending notification: {}", e.getMessage(), e);
        }
    }

    public List<WebNotificationDTO> getAndMarkPendingWebNotifications(String recipientEmail) {
        List<InstantNotification> pendingNotifications = instantNotificationRepository
                .findByRecipientIdAndWebStatus(recipientEmail, NotificationStatus.PENDING);

        if (pendingNotifications.isEmpty()) {
            return List.of();
        }

        List<WebNotificationDTO> dtos = pendingNotifications.stream()
                .map(notification -> {
                    notification.markAsWebViewed();
                    return WebNotificationDTO.builder()
                            .title(notification.getTitle())
                            .message(notification.getMessage())
                            .type(notification.getType())
                            .build();
                })
                .collect(Collectors.toList());

        instantNotificationRepository.saveAll(pendingNotifications);

        return dtos;
    }
}
