package org.alumnet.infrastructure.scheduler;

import com.mailgun.api.v3.MailgunMessagesApi;
import com.mailgun.model.message.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.alumnet.application.services.NotificationService;
import org.alumnet.domain.notifications.ScheduledNotification;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class ScheduleNotificationWorker {
    private final NotificationService notificationService;
    private final MailgunMessagesApi mailgunMessagesApi;
    @Value("${mailgun.domain}")
    private String DOMAIN;

    @Scheduled(cron = "0 */15 * * * *")
    public void sendNotification() {
        log.info("Running scheduled task to process pending notifications");
        List<ScheduledNotification> scheduledNotifications = notificationService.processPendingNotifications();
        scheduledNotifications.forEach(scheduledNotification -> {
            log.info("Sending email for notification id: {}", scheduledNotification.getId());
            Message message = Message.builder().from("noreply@alumnet-uy.org")
                    .to(scheduledNotification.getRecipientIds())
                    .subject(scheduledNotification.getTitle())
                    .text(scheduledNotification.getMessage()).build();
            mailgunMessagesApi.sendMessage(DOMAIN,message);
            notificationService.markNotificationAsSent(scheduledNotification);
        });
    }
}
