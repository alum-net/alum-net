package org.alumnet.infrastructure.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.enums.ActivityType;
import org.alumnet.application.services.UserActivityLogService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class ContentAccessLoggingFilter extends OncePerRequestFilter {

    private final UserActivityLogService activityLogService;

    private static final Pattern COURSE_PATTERN = Pattern.compile("/api/courses/(\\d+)(?:/|$)");
    private static final Pattern SECTION_PATTERN = Pattern.compile("/api/sections/(\\d+)(?:/|$)");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        filterChain.doFilter(request, response);
        if (request.getMethod().equalsIgnoreCase("GET")) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()) {

                String userEmail = authentication.getName();
                String uri = request.getRequestURI();

                attemptLog(userEmail, uri, COURSE_PATTERN, ActivityType.COURSE_ACCESS, "Curso");
                attemptLog(userEmail, uri, SECTION_PATTERN, ActivityType.SECTION_ACCESS, "Sección");
            }
        }
    }

    private boolean attemptLog(String userEmail, String uri, Pattern pattern, ActivityType type, String resourceName) {
        Matcher matcher = pattern.matcher(uri);

        if (matcher.find()) {
            String resourceId = matcher.group(1);

            activityLogService.logActivity(
                    userEmail,
                    type,
                    String.format("Acceso a %s con ID %s", resourceName, resourceId),
                    resourceId
            );
            return true;
        }
        return false;
    }
}