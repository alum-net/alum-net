package org.alumnet.application.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.responses.UserActivityLogDTO;
import org.alumnet.application.enums.ActivityType;
import org.alumnet.application.mapper.ActivityMapper;
import org.alumnet.domain.UserActivityLog;
import org.alumnet.domain.repositories.UserActivityLogRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.exceptions.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserActivityLogService {

    private final UserActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final ActivityMapper activityMapper;

    private static final long LOGIN_GRACE_PERIOD_MINUTES = 5;

    @Transactional
    public void logActivity(String userEmail, ActivityType type, String description, String resourceId) {
        User user = userRepository.findById(userEmail)
                .orElseThrow(UserNotFoundException::new);

        UserActivityLog log = UserActivityLog.builder()
                .user(user)
                .activityType(type)
                .description(description)
                .resourceId(resourceId)
                .timestamp(LocalDateTime.now())
                .build();

        activityLogRepository.save(log);
    }

    @Transactional
    public void logSuccessfulLoginIfNecessary(String userEmail) {

        UserActivityLog lastLogin = activityLogRepository
                .findTopByUserEmailAndActivityTypeOrderByTimestampDesc(userEmail, ActivityType.LOGIN_SUCCESS);

        boolean shouldLog = true;

        if (lastLogin != null) {
            long minutesSinceLastLogin = ChronoUnit.MINUTES.between(lastLogin.getTimestamp(), LocalDateTime.now());

            if (minutesSinceLastLogin < LOGIN_GRACE_PERIOD_MINUTES) {
                shouldLog = false;
            }
        }

        if (shouldLog) {
            logActivity(
                    userEmail,
                    ActivityType.LOGIN_SUCCESS,
                    "Inicio de sesión registrado por filtro de seguridad.",
                    null
            );
        }
    }

    @Transactional(readOnly = true)
    public Page<UserActivityLogDTO> getUserActivityHistory(String userEmail, Pageable pageable) {

        Page<UserActivityLog> logPage = activityLogRepository.findByUserEmailOrderByTimestampDesc(userEmail, pageable);

        return logPage.map(activityMapper::toUserActivityLogDTO);
    }
}