package org.alumnet.application.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.alumnet.application.dtos.CourseDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.domain.Course;
import org.alumnet.domain.users.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-27T16:22:45-0300",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public CourseDTO courseToCourseDTO(Course course) {
        if ( course == null ) {
            return null;
        }

        CourseDTO.CourseDTOBuilder courseDTO = CourseDTO.builder();

        courseDTO.shift( course.getShift() );
        courseDTO.teachers( teacherListToUserDTOList( course.getTeachers() ) );
        courseDTO.year( course.getStartDate() );
        courseDTO.approvalGrade( course.getApprovalGrade() );
        courseDTO.description( course.getDescription() );
        courseDTO.endDate( course.getEndDate() );
        courseDTO.id( String.valueOf( course.getId() ) );
        courseDTO.name( course.getName() );
        courseDTO.startDate( course.getStartDate() );

        return courseDTO.build();
    }

    protected List<UserDTO> teacherListToUserDTOList(List<Teacher> list) {
        if ( list == null ) {
            return null;
        }

        List<UserDTO> list1 = new ArrayList<UserDTO>( list.size() );
        for ( Teacher teacher : list ) {
            list1.add( userMapper.teacherToUserDTO( teacher ) );
        }

        return list1;
    }
}
