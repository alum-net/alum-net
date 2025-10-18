package org.alumnet.infrastructure.security;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Value("${jwt.auth.principleAttribute}")
    private String jwtAuthPrincipleAttribute;


    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        return new JwtAuthenticationToken(jwt, extractAllResourceAccessRoles(jwt), getPrincipleClaimName(jwt));
    }


    private String getPrincipleClaimName(Jwt jwt) {
        return jwtAuthPrincipleAttribute != null ? jwt.getClaim(jwtAuthPrincipleAttribute) : jwt.getClaim(JwtClaimNames.SUB);
    }

    @SuppressWarnings("unchecked")
    private Collection<? extends GrantedAuthority> extractAllResourceAccessRoles(Jwt jwt) {
        if (jwt == null)
            return Collections.emptyList();

        Object resourceAccessObj = jwt.getClaim("resource_access");
        if (!(resourceAccessObj instanceof Map))
            return Collections.emptyList();


        Map<String, Object> resourceAccess = (Map<String, Object>) resourceAccessObj;
        Set<SimpleGrantedAuthority> allRoles = new HashSet<>();

        for (Map.Entry<String, Object> clientEntry : resourceAccess.entrySet()) {
            Object clientObj = clientEntry.getValue();

            if (!(clientObj instanceof Map))
                continue;


            Map<String, Object> clientMap = (Map<String, Object>) clientObj;
            Object rolesObj = clientMap.get("roles");

            if (!(rolesObj instanceof Collection))
                continue;


            Collection<SimpleGrantedAuthority> clientRoles = ((Collection<?>) rolesObj).stream()
                    .filter(Objects::nonNull)
                    .map(Object::toString)
                    .filter(role -> !role.trim().isEmpty())
                    .map(role -> "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet());

            allRoles.addAll(clientRoles);
        }

        return allRoles;
    }
}
