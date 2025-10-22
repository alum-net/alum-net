package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {

    @Query("""
        select (count(courseParticipation) > 0) from CourseParticipation courseParticipation
        where courseParticipation.course.id = :courseId
    """)
    boolean hasEnrolledStudents(@Param("courseId") int courseId);

    @Query("SELECT cp.student.email as student " + "FROM CourseParticipation cp WHERE cp.id.courseId = :courseId")
    List<String> findStudentsEmailsByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT COUNT(cp) FROM CourseParticipation cp WHERE cp.id.courseId = :courseId")
    Integer countStudentsByCourseId(@Param("courseId") Integer courseId);
}