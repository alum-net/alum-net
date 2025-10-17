package org.alumnet.infrastructure.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    @Autowired
    private KeycloakProperties properties;


    @Bean
    public Keycloak keycloakServiceAccount() {
        return KeycloakBuilder.builder()
                .serverUrl(properties.getUrl())
                .realm(properties.getName())
                .grantType(OAuth2Constants.PASSWORD)
                .clientId(properties.getClientId())
                .build();
    }
}

