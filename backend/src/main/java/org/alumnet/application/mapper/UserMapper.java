package org.alumnet.application.mapper;

import org.alumnet.application.dtos.UserCreationRequestDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.domain.users.Administrator;
import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.Teacher;
import org.alumnet.domain.users.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    default User userDTOToUserCreationRequest(UserCreationRequestDTO userCreationRequestDTO) {
        return switch (userCreationRequestDTO.getGroup()) {
            case "students" -> studentCreationDTOToStudent(userCreationRequestDTO);
            case "teachers" -> teacherCreationDTOToTeacher(userCreationRequestDTO);
            case "admins" -> administratorCreationDTOToAdministrator(userCreationRequestDTO);
            default -> throw new IllegalArgumentException("Unknown role: " + userCreationRequestDTO.getGroup());
        };
    }

    @Mapping(target = "enabled", constant = "true")
    Administrator administratorCreationDTOToAdministrator(UserCreationRequestDTO userCreationRequestDTO);
    @Mapping(target = "enabled", constant = "true")
    Teacher teacherCreationDTOToTeacher(UserCreationRequestDTO userCreationRequestDTO);
    @Mapping(target = "enabled", constant = "true")
    Student studentCreationDTOToStudent(UserCreationRequestDTO userCreationRequestDTO);


    default UserDTO userToUserDTO(User user){
        return switch (user) {
            case Administrator admin -> administratorToUserDTO(admin);
            case Teacher teacher -> teacherToUserDTO(teacher);
            case Student student -> studentToUserDTO(student);
            default -> throw new IllegalArgumentException("Unknown User subclass: " + user.getClass().getName());
        };
    }

    @Mapping(target = "role", constant = "ADMIN")
    UserDTO administratorToUserDTO(Administrator administrator);
    @Mapping(target = "role", constant = "TEACHER")
    UserDTO teacherToUserDTO(Teacher teacher);
    @Mapping(target = "role", constant = "STUDENT")
    UserDTO studentToUserDTO(Student student);
}
