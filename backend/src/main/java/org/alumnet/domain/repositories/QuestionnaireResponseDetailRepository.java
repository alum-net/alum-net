package org.alumnet.domain.repositories;

import org.alumnet.domain.events.QuestionnaireResponseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface QuestionnaireResponseDetailRepository extends JpaRepository<QuestionnaireResponseDetail, Integer> {
    @Query("""
    SELECT qrd FROM QuestionnaireResponseDetail qrd 
    LEFT JOIN FETCH qrd.question q
    LEFT JOIN FETCH qrd.studentAnswer a
    LEFT JOIN FETCH qrd.attempt ep
    LEFT JOIN FETCH ep.student s
    WHERE ep.event.id = :eventId
    """)
    Set<QuestionnaireResponseDetail> findAllResponsesByEventId(@Param("eventId") Integer eventId);
}
