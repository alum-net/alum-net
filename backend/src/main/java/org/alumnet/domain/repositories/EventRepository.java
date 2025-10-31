package org.alumnet.domain.repositories;

import org.alumnet.domain.events.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Integer> {
    @Query("SELECT CASE WHEN COUNT(ep) > 0 THEN TRUE ELSE FALSE END " +
            "FROM EventParticipation ep WHERE ep.event.id = :eventId")
    boolean someParticipationByEventId(@Param("eventId") int eventId);
}
