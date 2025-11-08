package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface CourseParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {
    @Query("SELECT cp FROM CourseParticipation cp " +
            "WHERE cp.id.courseId = :courseId " +
            "AND cp.id.studentEmail IN :studentEmails")
    List<CourseParticipation> findAllByCourseIdAndEmails(int courseId, Set<String> studentEmails);

    List<CourseParticipation> findAllByCourseId(int courseId);
}