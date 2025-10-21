package org.alumnet.domain.repositories;

import org.alumnet.domain.Course;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    @Query("""
      select count(c) from Course c
      where c.id = :courseId
        and c.enabled = true
        and current_timestamp between c.startDate and c.endDate
    """)
    long countActive(@Param("courseId") int courseId);

    default boolean isCourseActive(int courseId) {
        return countActive(courseId) > 0;
    }

    @Modifying
    @Query("update Course course set course.enabled = false where course.id = :courseId")
    void deactivateCourse(@Param("courseId") int courseId);
}
