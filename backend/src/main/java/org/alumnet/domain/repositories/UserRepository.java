package org.alumnet.domain.repositories;

import org.alumnet.domain.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    @Query("""
    SELECT s.email FROM Student s 
    WHERE s IN (
        SELECT cp.student FROM CourseParticipation cp 
        WHERE cp.course.id = :courseId
    )
    AND s NOT IN (
        SELECT ep.student FROM EventParticipation ep 
        WHERE ep.event.id = :eventId 
        AND ep.resource IS NOT NULL
    )
    """)
    Set<String> findStudentsWithPendingSubmission(
            @Param("eventId") Integer eventId,
            @Param("courseId") Integer courseId
    );
}
