package org.alumnet.domain.repositories;

import org.alumnet.application.enums.NotificationStatus;
import org.alumnet.domain.notifications.InstantNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstantNotificationRepository extends MongoRepository<InstantNotification, String> {
    List<InstantNotification> findByRecipientIdAndWebStatus(String recipientId, NotificationStatus webStatus);
}
