package org.alumnet.domain.repositories;

import org.alumnet.domain.events.EventParticipation;
import org.alumnet.domain.events.EventParticipationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventParticipationRepository extends JpaRepository<EventParticipation, EventParticipationId> {
}
