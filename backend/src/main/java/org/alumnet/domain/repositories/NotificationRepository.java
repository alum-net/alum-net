package org.alumnet.domain.repositories;

import org.alumnet.application.enums.NotificationStatus;
import org.alumnet.domain.ScheduledNotification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends MongoRepository<ScheduledNotification, String> {
    List<ScheduledNotification> findByStateAndScheduledSendTimeBefore(NotificationStatus state, LocalDateTime dateTime);
}
