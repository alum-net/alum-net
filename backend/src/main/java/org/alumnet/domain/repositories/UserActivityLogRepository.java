package org.alumnet.domain.repositories;

import org.alumnet.application.enums.ActivityType;
import org.alumnet.domain.audit.UserActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {
    Page<UserActivityLog> findByUserEmailOrderByTimestampDesc(String userEmail, Pageable pageable);
    UserActivityLog findTopByUserEmailAndActivityTypeOrderByTimestampDesc(String userEmail, ActivityType activityType);
}