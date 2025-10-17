package org.alumnet.application.services;

import jakarta.ws.rs.core.Response;
import org.alumnet.application.dtos.ResultResponse;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.mapper.UserMapper;
import org.alumnet.domain.User;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.infrastructure.config.KeycloakProperties;
import org.alumnet.infrastructure.exceptions.ExistingUserException;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private Keycloak keycloak;

    @Autowired
    private KeycloakProperties properties;

    @Autowired
    private UserRepository userRepository;

    public ResultResponse createUser(UserDTO userDTO) throws ExistingUserException {
        if(isRegisteredUser(userDTO.getEmail()))
            throw new ExistingUserException("User with email " + userDTO.getEmail() + " already exists");

        UserRepresentation userRepresentation = createUserRepresentation(userDTO);
        ResultResponse response = ResultResponse.builder().build();
        try (Response keycloakResponse = keycloak.realm(properties.getRealm()).users().create(userRepresentation)){
            if (keycloakResponse.getStatus() != 201) {
                response.addError("Error creating userRepresentation: " + keycloakResponse.getStatus());
                return response;
            }
        }
        saveUser(userDTO);
        response.setMessage("Successfully created user");
        return response;
    }

    private boolean isRegisteredUser(String email) {
        return userRepository.existsById(email) || !keycloak.realm(properties.getRealm()).users().searchByEmail(email,true).isEmpty();
    }

    private void saveUser(UserDTO userDTO) {
        User user = UserMapper.INSTANCE.userDTOToUser(userDTO);
        userRepository.save(user);
    }

    private UserRepresentation createUserRepresentation(UserDTO userDTO) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userDTO.getEmail());
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getName());
        user.setLastName(userDTO.getLastname());
        user.setEnabled(true);
        user.setGroups(List.of(userDTO.getRole()));
        user.setEmailVerified(true);
        return user;
    }
}
