package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import org.springframework.data.repository.query.Param;

import java.util.Set;


public interface CourseParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {
    @EntityGraph(attributePaths = {"student"}) // Opcional: Para el fetch join
    List<CourseParticipation> findAllById_CourseId(Integer courseId);
    @Query("SELECT cp FROM CourseParticipation cp " +
            "WHERE cp.id.courseId = :courseId " +
            "AND cp.id.studentEmail IN :studentEmails")
    List<CourseParticipation> findAllByCourseIdAndEmails(int courseId, Set<String> studentEmails);

    List<CourseParticipation> findAllByCourseId(int courseId);

    @Query("SELECT c.id FROM CourseParticipation cp " +
            "JOIN cp.course c " +
            "WHERE cp.student.email = :email " +
            "AND c.enabled = true")
    Set<Integer> findActiveCourseIdsByStudentEmail(@Param("email") String email);

}