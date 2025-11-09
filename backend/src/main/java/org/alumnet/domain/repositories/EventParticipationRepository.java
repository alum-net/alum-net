package org.alumnet.domain.repositories;

import org.alumnet.domain.events.EventParticipation;
import org.alumnet.domain.events.EventParticipationId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventParticipationRepository extends JpaRepository<EventParticipation, EventParticipationId> {
    @EntityGraph(attributePaths = {"student", "resource"})
    List<EventParticipation> findAllById_EventId(Integer eventId);
}
