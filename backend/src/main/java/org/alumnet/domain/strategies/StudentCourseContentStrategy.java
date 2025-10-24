package org.alumnet.domain.strategies;

import org.alumnet.application.dtos.CourseContentDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.SectionDTO;
import org.alumnet.application.mapper.SectionMapper;
import org.alumnet.domain.CourseParticipationId;
import org.alumnet.domain.repositories.ParticipationRepository;
import org.alumnet.domain.repositories.SectionRepository;
import org.alumnet.infrastructure.exceptions.InsufficientPermissionsException;
import org.springframework.stereotype.Component;

@Component
public class StudentCourseContentStrategy extends CourseContentStrategy {

    private final ParticipationRepository participationRepository;

    protected StudentCourseContentStrategy(SectionRepository sectionRepository,
                                           SectionMapper sectionMapper,
                                           ParticipationRepository participationRepository) {
        super(sectionRepository, sectionMapper, participationRepository);
        this.participationRepository = participationRepository;
    }


    @Override
    protected void validate(String userId, Integer courseId) {
        participationRepository.findById(CourseParticipationId.builder()
                .courseId(courseId)
                .studentEmail(userId).build()).orElseThrow(InsufficientPermissionsException::new);
    }

    @Override
    protected CourseContentDTO buildCourseContentDTO(Integer courseId, String userId, PageableResultResponse<SectionDTO> sectionDTOS) {
        return CourseContentDTO.builder()
                .sections(sectionDTOS)
                .build();
    }
}
