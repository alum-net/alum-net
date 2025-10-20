package org.alumnet.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class KeycloakConfig {

    @Autowired
    private KeycloakProperties properties;


    @Bean
    public Keycloak keycloakServiceAccount() {
        log.info("Inicializando Keycloak con configuración:");
        log.info("➡️ URL: {}", properties.getUrl());
        log.info("➡️ Realm: {}", properties.getRealm());
        log.info("➡️ Client ID: {}", properties.getClientId());
        log.info("➡️ Username: {}", properties.getUsername());
        log.info("➡️ Password: {}", properties.getPassword());

        return KeycloakBuilder.builder()
                .serverUrl(properties.getUrl())
                .realm(properties.getRealm())
                .grantType(OAuth2Constants.PASSWORD)
                .clientId(properties.getClientId())
                .username(properties.getUsername())
                .password(properties.getPassword())
                .build();
    }
}

