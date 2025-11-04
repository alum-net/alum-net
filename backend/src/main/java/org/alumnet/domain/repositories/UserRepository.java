package org.alumnet.domain.repositories;

import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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
}
