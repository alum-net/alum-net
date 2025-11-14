package org.alumnet.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public String sendNotification(String title, String message, List<String> externalUserIds, LocalDateTime sendTime)
            throws JsonProcessingException {
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

        ResponseEntity<String> response = buildRestTemplate().postForEntity(
                "/notifications?c=push",
                payload, String.class);
        JsonNode responseJson = MAPPER.readTree(response.getBody());
        boolean hasErrors = responseJson.has("errors") && responseJson.get("errors").isArray()
                && !responseJson.get("errors").isEmpty();
        boolean hasValidId = responseJson.has("id") && !responseJson.get("id").asText().isBlank();

        if (response.getStatusCode().is2xxSuccessful() && !hasErrors && hasValidId) {
            log.info("Notification sent successfully: {}", response.getBody());
            return responseJson.get("id").asText();
        } else {
            log.error("Failed to send notification. Status: {}, Body: {}", response.getStatusCode(),
                    response.getBody());
        }
        return null;
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
