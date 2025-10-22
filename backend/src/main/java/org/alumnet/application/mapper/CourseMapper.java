package org.alumnet.application.mapper;

import org.alumnet.application.dtos.CourseDTO;
import org.alumnet.domain.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CourseMapper {

    @Mapping(target = "shiftType", source = "shift")
    @Mapping(target = "teachers", source = "teachers")
    @Mapping(source = "startDate", target = "year")
    CourseDTO courseToCourseDTO(Course course);
}
