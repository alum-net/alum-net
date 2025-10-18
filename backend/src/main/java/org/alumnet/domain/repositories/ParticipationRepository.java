package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {

    @Query("""
        select (count(courseParticipation) > 0) from CourseParticipation courseParticipation
        where courseParticipation.course.id = :courseId
    """)
    boolean hasEnrolledStudents(@Param("courseId") int courseId);
}