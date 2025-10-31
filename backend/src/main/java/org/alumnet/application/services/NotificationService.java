package org.alumnet.application.services;

import com.onesignal.client.ApiException;
import com.onesignal.client.api.DefaultApi;
import com.onesignal.client.model.CreateNotificationSuccessResponse;
import com.onesignal.client.model.LanguageStringMap;
import com.onesignal.client.model.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.alumnet.application.enums.NotificationStatus;
import org.alumnet.domain.ScheduledNotification;
import org.alumnet.domain.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final DefaultApi oneSignalApi;
    @Value("${onesignal.config.id}")
    private String oneSignalAppId;
    @Value("${send.notification.now:false}")
    private boolean sendNotificationNow;
    private final NotificationRepository notificationRepository;


    public String sendNotifications(String title, String message, List<String> userEmails, LocalDateTime endDate) {
        ScheduledNotification notification = null;
        try {
            notification = saveScheduledEmailNotification(title, message, userEmails, endDate);
            return sendPushNotifications(title, message, userEmails, endDate);
        } catch (ApiException e) {
            log.error("Error al enviar notificación: {}", e.getMessage(), e);
            notificationRepository.deleteById(notification.getId());
            throw new RuntimeException("Error comunicando con OneSignal", e);
        }
    }

    private String sendPushNotifications(String title, String message, List<String> userEmails, LocalDateTime endDate) throws ApiException {
        log.info("Enviando notificación a {} usuarios: {} - {}", userEmails.size(), title, message);
        log.info("sendNotificationNow: {}", sendNotificationNow);
        Notification notification = createNotification();
        notification.setHeadings(createLanguageStringMap(title));
        notification.setContents(createLanguageStringMap(message));
        notification.setIncludeAliases(Map.of("external_id", userEmails));
        notification.setTargetChannel(Notification.TargetChannelEnum.PUSH);
        if (!sendNotificationNow && endDate.minusHours(24).isAfter(LocalDateTime.now()))
            notification.setSendAfter(endDate.minusHours(24).atZone(ZoneId.systemDefault()).toOffsetDateTime());

        return send(notification);
    }

    private ScheduledNotification saveScheduledEmailNotification(String title, String message, List<String> userEmails, LocalDateTime endDate) {
        //Contemplar caso borde de que pasa si el endDate es mañana y le resto 24 horas (la notificación se debería enviar inmediatamente)
        return notificationRepository.save(ScheduledNotification.builder()
                .title(title).
                message(message).
                recipientIds(userEmails).
                state(NotificationStatus.PENDING).
                scheduledSendTime(endDate.minusHours(24)).
                build());
    }


    private Notification createNotification() {
        Notification notification = new Notification();
        notification.setAppId(oneSignalAppId);
        notification.setIsChrome(true);
        notification.setIsAnyWeb(true);
        notification.setIsFirefox(true);
        notification.setIsSafari(true);
        return notification;
    }

    private LanguageStringMap createLanguageStringMap(String text) {
        LanguageStringMap map = new LanguageStringMap();
        map.en(text);
        map.es(text);
        return map;
    }

    private String send(Notification notification) throws ApiException {
        if (log.isDebugEnabled()) {
            Map<String, Object> payload = createPayloadMap(notification);
            log.debug("Payload: {}", payload);
        }

        CreateNotificationSuccessResponse response = oneSignalApi.createNotification(notification);

        log.info("Notificación enviada con ID: {}", response.getId());
        return response.getId();
    }

    private Map<String, Object> createPayloadMap(Notification notification) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("app_id", oneSignalAppId);

        if (notification.getContents() != null) {
            Map<String, String> contents = new HashMap<>();
            LanguageStringMap contentsMap = notification.getContents();
            if (contentsMap.getEn() != null) {
                contents.put("en", contentsMap.getEn());
            }
            if (contentsMap.getEs() != null) {
                contents.put("es", contentsMap.getEs());
            }
            payload.put("contents", contents);
        }

        if (notification.getHeadings() != null) {
            Map<String, String> headings = new HashMap<>();
            LanguageStringMap headingsMap = notification.getHeadings();
            if (headingsMap.getEn() != null) {
                headings.put("en", headingsMap.getEn());
            }
            if (headingsMap.getEs() != null) {
                headings.put("es", headingsMap.getEs());
            }
            payload.put("headings", headings);
        }


        if (notification.getIncludedSegments() != null) {
            payload.put("included_segments", notification.getIncludedSegments());
        }
        if (notification.getIncludeEmailTokens() != null) {
            payload.put("include_external_user_ids", notification.getIncludeEmailTokens());
        }

        if (notification.getData() != null) {
            payload.put("data", notification.getData());
        }

        return payload;
    }

    public List<ScheduledNotification> processPendingNotifications() {
        return notificationRepository.findByStateAndScheduledSendTimeBefore(NotificationStatus.PENDING,
                LocalDateTime.now()
        );
    }

    public void markNotificationAsSent(ScheduledNotification notification) {
        notification.markAsSent();
        notificationRepository.save(notification);
    }
}
