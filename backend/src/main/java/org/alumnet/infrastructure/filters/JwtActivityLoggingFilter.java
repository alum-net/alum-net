package org.alumnet.infrastructure.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.services.UserActivityLogService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class JwtActivityLoggingFilter extends OncePerRequestFilter {
    @Value("${keycloak.username}")
    private String adminUserName;

    private final UserActivityLogService activityLogService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {

            String userEmail = authentication.getName();
            if(!Objects.equals(userEmail, adminUserName)){{
                activityLogService.logSuccessfulLoginIfNecessary(userEmail);
            }}
        }
        filterChain.doFilter(request, response);
    }
}