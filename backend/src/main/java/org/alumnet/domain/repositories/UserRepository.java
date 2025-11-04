package org.alumnet.domain.repositories;

import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    @Query("SELECT s FROM Student s " +
            "LEFT JOIN FETCH s.participations cp " +
            "WHERE s.email = :userEmail")
    Optional<Student> findUserWithCourseParticipations(String userEmail);

    @Query("""
    SELECT DISTINCT s FROM Student s 
    LEFT JOIN FETCH s.eventParticipations ep
    LEFT JOIN FETCH ep.event e
    LEFT JOIN FETCH e.section se
    WHERE s.email = :userEmail 
    AND (se.course.id = :courseId OR se.course.id IS NULL)
    """)
    Optional<Student> findUserWithEventParticipations(String userEmail, Integer courseId);

    @Query("""
            SELECT s.email FROM Student s 
            JOIN CourseParticipation cp ON cp.student = s
            JOIN EventParticipation ep ON ep.student = s
            WHERE cp.course.id = :courseId
            AND ep.event.id = :eventId
            AND ep.grade IS NULL
            AND ep.resource IS NULL
            """)
    Set<String> findStudentsWithPendingSubmission(
            @Param("eventId") Integer eventId,
            @Param("courseId") Integer courseId
    );
}
