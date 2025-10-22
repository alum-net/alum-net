package org.alumnet.application.mapper;

import org.alumnet.application.dtos.CourseDTO;
import org.alumnet.domain.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.ZoneId;
import java.util.Date;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CourseMapper {

    @Mapping(target = "shiftType", source = "shift")
    @Mapping(target = "teachers", source = "teachers")
    @Mapping(target = "year", expression = "java(getYearFromDate(course.getStartDate()))")
    CourseDTO courseToCourseDTO(Course course);

    default int getYearFromDate(Date date) {
        if (date == null) {
            return 0;
        }

        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .getYear();
    }
}
