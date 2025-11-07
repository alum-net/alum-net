package org.alumnet.domain.repositories;

import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseParticipationRepository extends JpaRepository<CourseParticipation, CourseParticipationId> {

    List<CourseParticipation> findByStudentEmail(String email);

}