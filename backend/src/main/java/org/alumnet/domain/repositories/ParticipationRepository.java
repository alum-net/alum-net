package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.alumnet.domain.users.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {

	@Query("""
			    select (count(cp) > 0) from CourseParticipation cp
			    where cp.course.id = :courseId
			    and cp.course.enabled = true
			    and cp.student.enabled = true
			""")
	boolean hasEnrolledStudents(@Param("courseId") int courseId);

	@Query("""
			    SELECT cp.student, cp.grade
			    FROM CourseParticipation cp
			    WHERE cp.course.id = :courseId
			    AND cp.course.enabled = true
			    AND cp.student.enabled = true
			""")
	List<Object[]> findEnrolledStudentsByCourseId(@Param("courseId") Integer courseId);

	@Query("""
			    SELECT COUNT(cp) FROM CourseParticipation cp
			    WHERE cp.course.id = :courseId
			    AND cp.course.enabled = true
			    AND cp.student.enabled = true
			""")
	Integer countStudentsByCourseId(@Param("courseId") Integer courseId);

}