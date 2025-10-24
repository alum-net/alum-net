package org.alumnet.domain.repositories;

import org.alumnet.domain.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer>, JpaSpecificationExecutor<Course> {

    @Query("""
      select count(c) from Course c
      where c.id = :courseId
        and c.enabled = true
        and current_timestamp between c.startDate and c.endDate
    """)
    long countActive(@Param("courseId") int courseId);

    @EntityGraph(attributePaths = {"teachers"})
    Page<Course> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"teachers"})
    Page<Course> findAll(Specification<Course> spec, Pageable pageable);

    @Query("""
        select count(t) from Course c
        join c.teachers t 
        where c.id = :courseId
          and c.enabled = true  
          and t.enabled = true  
    """)
    int countTeachersByCourseId(@Param("courseId") int courseId);
}
