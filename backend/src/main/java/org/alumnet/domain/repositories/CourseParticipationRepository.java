package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

import java.util.List;

public interface CourseParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {
    @EntityGraph(attributePaths = {"student"}) // Opcional: Para el fetch join
    List<CourseParticipation> findAllById_CourseId(Integer courseId);


    @Query("SELECT c.id FROM CourseParticipation cp " +
            "JOIN cp.course c " +
            "WHERE cp.student.email = :email " +
            "AND c.enabled = true")
    Set<Integer> findActiveCourseIdsByStudentEmail(@Param("email") String email);

}