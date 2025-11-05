package org.alumnet.application.mapper;

import org.alumnet.application.dtos.SectionDTO;
import org.alumnet.application.dtos.requests.SectionRequestDTO;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {EventMapper.class})
public interface SectionMapper {

    @Mapping(target = "sectionId", ignore = true)
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "course", source = "course")
    @Mapping(target = "sectionResources", ignore = true)
    @Mapping(target = "title", source = "dto.title")
    @Mapping(target = "description", source = "dto.description")
    Section toSectionWithCourse(SectionRequestDTO dto, Course course);

    @Mapping(target = "id", source = "section.sectionId")
    @Mapping(target = "summaryEvents", source = "section.events")
    SectionDTO sectionToSectionDTO(Section section);
}
