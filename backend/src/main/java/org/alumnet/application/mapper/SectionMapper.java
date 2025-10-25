package org.alumnet.application.mapper;

import org.alumnet.application.dtos.SectionCreationRequestDTO;
import org.alumnet.application.dtos.responses.SectionDTO;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SectionMapper {

    @Mapping(target = "sectionId", ignore = true)
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "course", source = "course")
    @Mapping(target = "sectionResources", ignore = true)
    @Mapping(target = "title", source = "dto.title")
    @Mapping(target = "description", source = "dto.description")
    Section toSectionWithCourse(SectionCreationRequestDTO dto, Course course);

    SectionDTO sectionToSectionDTO(Section section);
}
