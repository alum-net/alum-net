package org.alumnet.domain.repositories;

import jakarta.persistence.Entity;
import org.alumnet.application.dtos.StudentSummaryDTO;
import org.alumnet.domain.events.EventParticipation;
import org.alumnet.domain.events.EventParticipationId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface EventParticipationRepository extends JpaRepository<EventParticipation, EventParticipationId> {
	@Query("""
			    SELECT new org.alumnet.application.dtos.StudentSummaryDTO(
			        s.name,s.lastname,s.email)
			    FROM EventParticipation ep
			    JOIN ep.student s
			    WHERE ep.event.id = :eventId
			""")
	List<StudentSummaryDTO> findStudentSummaryByEventId(@Param("eventId") Integer eventId);

	@Query("SELECT cp FROM EventParticipation cp " +
			"WHERE cp.id.eventId = :eventId " +
			"AND cp.id.studentEmail IN :studentEmails")
	List<EventParticipation> findAllByEventIdAndEmails(int eventId, Set<String> studentEmails);

    @EntityGraph(attributePaths = { "student" })
	List<EventParticipation> findAllByIdEventId(Integer eventId);

	@EntityGraph(attributePaths = { "student", "resource" })
	List<EventParticipation> findAllById_EventId(Integer eventId);
}
