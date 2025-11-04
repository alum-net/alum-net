package org.alumnet.domain.repositories;

import org.alumnet.domain.events.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    @Query("SELECT CASE WHEN COUNT(ep) > 0 THEN TRUE ELSE FALSE END " +
            "FROM EventParticipation ep WHERE ep.event.id = :eventId " +
            "AND ep.grade IS NOT NULL OR ep.resource IS NOT NULL")
    boolean someParticipationByEventId(@Param("eventId") int eventId);
}
