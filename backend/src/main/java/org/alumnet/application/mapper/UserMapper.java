package org.alumnet.application.mapper;

import org.alumnet.application.dtos.UserDTO;
import org.alumnet.domain.Administrator;
import org.alumnet.domain.Student;
import org.alumnet.domain.Teacher;
import org.alumnet.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    default User userDTOToUser (UserDTO userDTO) {
        return switch (userDTO.getRole()) {
            case "students" -> studentDTOToStudent(userDTO);
            case "teachers" -> teacherDTOToTeacher(userDTO);
            case "admins" -> administratorDTOToAdministrator(userDTO);
            default -> throw new IllegalArgumentException("Unknown role: " + userDTO.getRole());
        };
    }
    @Mapping(target = "enabled", constant = "true")
    Administrator administratorDTOToAdministrator(UserDTO userDTO);
    @Mapping(target = "enabled", constant = "true")
    Teacher teacherDTOToTeacher(UserDTO userDTO);
    @Mapping(target = "enabled", constant = "true")
    Student studentDTOToStudent(UserDTO userDTO);



}
