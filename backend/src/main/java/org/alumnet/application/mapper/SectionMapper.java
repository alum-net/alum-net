package org.alumnet.application.mapper;

import org.alumnet.application.dtos.SectionCreationRequestDTO;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.alumnet.domain.SectionId;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SectionMapper {

    @Mapping(source = "title", target = "id.title")
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "id.courseId", ignore = true)
    Section sectionCreationRequestDTOToSection(SectionCreationRequestDTO section);

    default Section toSectionWithCourse(SectionCreationRequestDTO dto, Course course) {
        Section section = sectionCreationRequestDTOToSection(dto);

        if (section.getId() == null) {
            section.setId(new SectionId());
        }
        section.getId().setCourseId(course.getId());
        section.setCourse(course);
        return section;
    }

}
