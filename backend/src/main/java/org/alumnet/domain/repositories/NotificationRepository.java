package org.alumnet.domain.repositories;

import org.alumnet.application.enums.NotificationStatus;
import org.alumnet.domain.notifications.ScheduledNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<ScheduledNotification, String> {
    List<ScheduledNotification> findByStateAndScheduledSendTimeBefore(NotificationStatus state, LocalDateTime dateTime);
}
