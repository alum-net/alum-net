package org.alumnet.domain.repositories;

import org.alumnet.domain.events.Event;
import org.alumnet.domain.events.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    @Query("SELECT CASE WHEN COUNT(ep) > 0 THEN TRUE ELSE FALSE END " +
            "FROM EventParticipation ep WHERE ep.event.id = :eventId")
    boolean someParticipationByEventId(@Param("eventId") int eventId);

    @Query("""
    SELECT q FROM Questionnaire q
    LEFT JOIN FETCH q.questions qs
    LEFT JOIN FETCH qs.answers a
    WHERE q.id = :eventId
    """)
    Optional<Questionnaire> findQuestionnaireById(@Param("eventId") Integer eventId);

    @Query("""
        SELECT e 
        FROM Event e 
        WHERE e.course.id = :courseId
        AND NOT EXISTS (
            SELECT 1 
            FROM EventParticipation ep 
            WHERE ep.event = e 
            AND ep.grade IS NOT NULL
        )
    """)
    List<Event> findUnratedEventsByCourse(Integer courseId);
}
