package org.alumnet.domain.strategies;

import org.alumnet.application.dtos.CourseContentDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.SectionDTO;
import org.alumnet.application.mapper.SectionMapper;
import org.alumnet.domain.repositories.ParticipationRepository;
import org.alumnet.domain.repositories.SectionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public abstract class CourseContentStrategy {

    protected final SectionRepository sectionRepository;
    protected final SectionMapper sectionMapper;
    protected final ParticipationRepository participationRepository;

    protected CourseContentStrategy(
            SectionRepository sectionRepository,
            SectionMapper sectionMapper,
            ParticipationRepository participationRepository) {

        this.sectionRepository = sectionRepository;
        this.sectionMapper = sectionMapper;
        this.participationRepository = participationRepository;
    }

    public CourseContentDTO getCourseContent(String userId, Integer courseId, Pageable page) {
        validate(userId, courseId);

        PageableResultResponse<SectionDTO> sectionsDTO = getSections(courseId,page);
        return buildCourseContentDTO(courseId,userId,sectionsDTO);

    }

    protected PageableResultResponse<SectionDTO> getSections(Integer courseId, Pageable page) {
        Page<SectionDTO> sectionPage = sectionRepository.findAllByCourseId(courseId, page)
                .map(sectionMapper::sectionToSectionDTO);
        return PageableResultResponse.fromPage(
                sectionPage,
                sectionPage.getContent(),
                sectionPage.getTotalElements() > 0
                        ? "Usuarios obtenidos exitosamente"
                        : "No se encontraron usuarios que coincidan con los filtros"
        );
    }

    protected abstract void validate(String userId, Integer courseId);

    protected Integer getTotalEnrollments(Integer courseId) {
        return participationRepository.countStudentsByCourseId(courseId);
    }
    protected abstract CourseContentDTO buildCourseContentDTO(Integer courseId, String userId, PageableResultResponse<SectionDTO> sectionDTOS);

}
