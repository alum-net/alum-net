package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {

}