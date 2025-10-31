package org.alumnet.infrastructure.config;

import com.onesignal.client.ApiClient;
import com.onesignal.client.api.DefaultApi;
import com.onesignal.client.auth.HttpBearerAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OneSignalConfig {
    @Value("${onesignal.config.id}")
    private String appId = "YOUR_APP_ID";
    @Value("${onesignal.config.rest.api-key}")
    private String restApiKey = "YOUR_REST_API_KEY";

    @Bean
    public ApiClient oneSignalApiClient() {
        ApiClient apiClient = com.onesignal.client.Configuration.getDefaultApiClient();
        apiClient.setBasePath("https://api.onesignal.com");
        apiClient.setConnectTimeout(30000);

        apiClient.setReadTimeout(30000);
        HttpBearerAuth restApiAuth = (HttpBearerAuth) apiClient
                .getAuthentication("rest_api_key");
        restApiAuth.setBearerToken(restApiKey);

        return apiClient;
    }

    @Bean
    public DefaultApi oneSignalApi(ApiClient oneSignalApiClient) {
        return new DefaultApi(oneSignalApiClient);
    }

    @Bean
    public String oneSignalAppId() {
        return appId;
    }
}
