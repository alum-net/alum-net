package org.alumnet.domain.repositories;

import org.alumnet.domain.events.Event;
import org.alumnet.domain.events.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
	@Query("SELECT CASE WHEN COUNT(ep) > 0 THEN TRUE ELSE FALSE END " +
			"FROM EventParticipation ep LEFT JOIN ep.responses qr WHERE ep.event.id = :eventId " +
			"AND ( ep.grade IS NOT NULL OR ep.resource IS NOT NULL OR qr IS NOT NULL )")
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

	@Query("""
			SELECT e FROM Event e
			JOIN FETCH e.section s
			JOIN FETCH s.course c
			JOIN c.teachers t
			WHERE
			    t.email = :teacherEmail AND
			    e.startDate >= COALESCE(:since, e.startDate) AND
			    e.endDate <= COALESCE(:to, e.endDate)
			""")
	List<Event> findEventsByTeacherEmailAndDates(
			@Param("teacherEmail") String teacherEmail,
			@Param("since") LocalDateTime since,
			@Param("to") LocalDateTime to);

	@Query("""
			SELECT e FROM Event e
			JOIN FETCH e.section s
			JOIN FETCH s.course c
			JOIN c.participations cp
			JOIN cp.student stud
			WHERE
			    stud.email = :studentEmail AND
			    e.startDate >= COALESCE(:since, e.startDate) AND
			    e.endDate <= COALESCE(:to, e.endDate)
			""")
	List<Event> findEventsByStudentEmailAndDates(
			@Param("studentEmail") String studentEmail,
			@Param("since") LocalDateTime since,
			@Param("to") LocalDateTime to);
}
