package org.alumnet.application.mapper;

import javax.annotation.processing.Generated;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.requests.UserCreationRequestDTO;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.users.Administrator;
import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.Teacher;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-27T16:22:45-0300",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public Administrator administratorCreationDTOToAdministrator(UserCreationRequestDTO userCreationRequestDTO) {
        if ( userCreationRequestDTO == null ) {
            return null;
        }

        Administrator administrator = new Administrator();

        administrator.setEmail( userCreationRequestDTO.getEmail() );
        administrator.setLastname( userCreationRequestDTO.getLastname() );
        administrator.setName( userCreationRequestDTO.getName() );

        administrator.setEnabled( true );

        return administrator;
    }

    @Override
    public Teacher teacherCreationDTOToTeacher(UserCreationRequestDTO userCreationRequestDTO) {
        if ( userCreationRequestDTO == null ) {
            return null;
        }

        Teacher teacher = new Teacher();

        teacher.setEmail( userCreationRequestDTO.getEmail() );
        teacher.setLastname( userCreationRequestDTO.getLastname() );
        teacher.setName( userCreationRequestDTO.getName() );

        teacher.setEnabled( true );

        return teacher;
    }

    @Override
    public Student studentCreationDTOToStudent(UserCreationRequestDTO userCreationRequestDTO) {
        if ( userCreationRequestDTO == null ) {
            return null;
        }

        Student student = new Student();

        student.setEmail( userCreationRequestDTO.getEmail() );
        student.setLastname( userCreationRequestDTO.getLastname() );
        student.setName( userCreationRequestDTO.getName() );

        student.setEnabled( true );

        return student;
    }

    @Override
    public UserDTO administratorToUserDTO(Administrator administrator) {
        if ( administrator == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setAvatarUrl( administrator.getAvatarUrl() );
        userDTO.setEmail( administrator.getEmail() );
        userDTO.setEnabled( administrator.isEnabled() );
        userDTO.setLastname( administrator.getLastname() );
        userDTO.setName( administrator.getName() );

        userDTO.setRole( UserRole.ADMIN );

        return userDTO;
    }

    @Override
    public UserDTO teacherToUserDTO(Teacher teacher) {
        if ( teacher == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setAvatarUrl( teacher.getAvatarUrl() );
        userDTO.setEmail( teacher.getEmail() );
        userDTO.setEnabled( teacher.isEnabled() );
        userDTO.setLastname( teacher.getLastname() );
        userDTO.setName( teacher.getName() );

        userDTO.setRole( UserRole.TEACHER );

        return userDTO;
    }

    @Override
    public UserDTO studentToUserDTO(Student student) {
        if ( student == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setAvatarUrl( student.getAvatarUrl() );
        userDTO.setEmail( student.getEmail() );
        userDTO.setEnabled( student.isEnabled() );
        userDTO.setLastname( student.getLastname() );
        userDTO.setName( student.getName() );

        userDTO.setRole( UserRole.STUDENT );

        return userDTO;
    }
}
