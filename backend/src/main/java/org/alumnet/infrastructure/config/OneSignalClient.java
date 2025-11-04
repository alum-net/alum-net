package org.alumnet.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.alumnet.application.dtos.responses.OneSignalCreateNotificationDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OneSignalClient {
    @Value("${onesignal.config.rest.api-key}")
    private String restApiKey;
    @Value("${onesignal.config.id}")
    private String appId;

    public String sendNotification(String title, String message, List<String> externalUserIds, LocalDateTime sendTime) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("app_id", appId);
        payload.put("include_external_user_ids", externalUserIds);
        payload.put("target_channel", "push");
        payload.put("contents", Map.of("en", message, "es", message));
        payload.put("headings", Map.of("en", title, "es", title));

        if (sendTime != null && sendTime.isAfter(LocalDateTime.now())) {
            payload.put("send_after", sendTime.atZone(ZoneId.systemDefault()).toOffsetDateTime().toString());
        }

        log.debug("Sending OneSignal notification payload: {}", payload);

        ResponseEntity<OneSignalCreateNotificationDTO> response = buildRestTemplate().postForEntity(
                "/notifications?c=push",
                payload, OneSignalCreateNotificationDTO.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody().getId().isPresent()) {
            log.info("Notification sent successfully: {}", response.getBody());
            return response.getBody().getId().get();
        } else {
            log.error("Failed to send notification. Status: {}, Body: {}", response.getStatusCode(),
                    response.getBody());
            throw new RuntimeException("Failed to send OneSignal notification: " + response.getBody());
        }
    }

    public void cancelNotification(String notificationId) {
        log.info("Cancelling OneSignal notification: {}", notificationId);
        buildRestTemplate().delete("/notifications/" + notificationId + "?app_id=" + appId);
    }

    private RestTemplate buildRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setUriTemplateHandler(new DefaultUriBuilderFactory("https://api.onesignal.com"));

        ClientHttpRequestInterceptor interceptor = (request, body, execution) -> {
            request.getHeaders().add("Authorization", "Basic " + restApiKey);
            request.getHeaders().add("Content-Type", "application/json");
            return execution.execute(request, body);
        };

        restTemplate.getInterceptors().add(interceptor);
        return restTemplate;
    }
}
