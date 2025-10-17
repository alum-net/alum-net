package org.alumnet.application.mapper;

import org.alumnet.application.dtos.UserDTO;
import org.alumnet.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    User userToUserDTO(UserDTO user);
}
