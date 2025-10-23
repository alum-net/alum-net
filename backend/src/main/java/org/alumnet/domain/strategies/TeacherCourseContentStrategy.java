package org.alumnet.domain.strategies;

import org.alumnet.application.dtos.CourseContentDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.SectionDTO;
import org.alumnet.application.mapper.SectionMapper;
import org.alumnet.domain.repositories.CourseRepository;
import org.alumnet.domain.repositories.ParticipationRepository;
import org.alumnet.domain.repositories.SectionRepository;
import org.alumnet.infrastructure.exceptions.InsufficientPermissionsException;
import org.springframework.stereotype.Component;

@Component
public class TeacherCourseContentStrategy extends CourseContentStrategy {

    private final CourseRepository courseRepository;

    protected TeacherCourseContentStrategy(SectionRepository sectionRepository,
                                           SectionMapper sectionMapper,
                                           ParticipationRepository participationRepository,
                                           CourseRepository courseRepository) {
        super(sectionRepository, sectionMapper, participationRepository);
        this.courseRepository = courseRepository;
    }


    @Override
    protected void validate(String userId, Integer courseId) {
        courseRepository.findById(courseId)
                .filter(course -> course.getTeachers().stream()
                        .anyMatch(teacher -> teacher.getEmail().equals(userId)))
                .orElseThrow(InsufficientPermissionsException::new);
    }

    @Override
    protected CourseContentDTO buildCourseContentDTO(Integer courseId, String userId, PageableResultResponse<SectionDTO> sectionDTOS) {
        return CourseContentDTO.builder()
                .sections(sectionDTOS)
                .totalEnrollments(getTotalEnrollments(courseId))
                .build();
    }
}
