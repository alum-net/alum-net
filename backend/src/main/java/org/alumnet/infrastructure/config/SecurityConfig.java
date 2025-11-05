package org.alumnet.infrastructure.config;

import lombok.RequiredArgsConstructor;
import org.alumnet.infrastructure.security.JwtAuthConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthConverter jwtAuthConverter;
        @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
        private String jwkSetUri;

        @Value("#{'${spring.security.oauth2.resourceserver.jwt.valid-issuers}'.trim().split(',')}")
        private List<String> validIssuers;

        @Value("#{'${spring.application.cors.allowed-origins}'.trim().split(',')}")
        private List<String> validCors;

        @Bean
        public JwtDecoder jwtDecoder() {

                NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder
                                .withJwkSetUri(jwkSetUri)
                                .build();

                OAuth2TokenValidator<Jwt> multiIssuerValidator = getJwtOAuth2TokenValidator();

                OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(
                                new JwtTimestampValidator(),
                                multiIssuerValidator);

                jwtDecoder.setJwtValidator(validator);
                return jwtDecoder;
        }

        private OAuth2TokenValidator<Jwt> getJwtOAuth2TokenValidator() {

                return token -> {
                        String tokenIssuer = token.getIssuer().toString();

                        if (validIssuers.contains(tokenIssuer)) {
                                return OAuth2TokenValidatorResult.success();
                        }

                        OAuth2Error error = new OAuth2Error(
                                        "invalid_token",
                                        "The token was not issued by a valid issuer. Expected one of " + validIssuers
                                                        + " but got " + tokenIssuer,
                                        null);
                        return OAuth2TokenValidatorResult.failure(error);
                };
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(authorize -> authorize.requestMatchers(HttpMethod.OPTIONS, "/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(jwt -> jwt
                                                                .decoder(jwtDecoder())
                                                                .jwtAuthenticationConverter(jwtAuthConverter)))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(validCors);
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

}
