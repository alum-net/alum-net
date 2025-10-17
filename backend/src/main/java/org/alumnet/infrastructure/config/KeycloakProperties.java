package org.alumnet.infrastructure.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "keycloak")
@Configuration
@Data
public class KeycloakProperties {
    private String url;
    private String clientId;
    private String name;
    private String realm;

}