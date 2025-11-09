package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {
    @EntityGraph(attributePaths = {"student"}) // Opcional: Para el fetch join
    List<CourseParticipation> findAllById_CourseId(Integer courseId);
}