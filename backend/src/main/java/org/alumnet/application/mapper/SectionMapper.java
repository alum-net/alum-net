package org.alumnet.application.mapper;

import org.alumnet.application.dtos.SectionRequestDTO;
import org.alumnet.application.dtos.SectionDTO;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.alumnet.domain.SectionId;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SectionMapper {

    @Mapping(source = "title", target = "id.title")
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "id.courseId", ignore = true)
    Section sectionCreationRequestDTOToSection(SectionRequestDTO section);

    default Section toSectionWithCourse(SectionRequestDTO dto, Course course) {
        Section section = sectionCreationRequestDTOToSection(dto);

        if (section.getId() == null) {
            section.setId(new SectionId());
        }
        section.getId().setCourseId(course.getId());
        section.setCourse(course);
        return section;
    }

    @Mapping(source = "id.title", target = "title")
    SectionDTO sectionToSectionDTO(Section section);

}
