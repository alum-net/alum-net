package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface CourseParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {


    @Query("SELECT c.id FROM CourseParticipation cp " +
            "JOIN cp.course c " +
            "WHERE cp.student.email = :email " +
            "AND c.enabled = true")
    Set<Integer> findActiveCourseIdsByStudentEmail(@Param("email") String email);

}