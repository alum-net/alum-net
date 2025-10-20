package org.alumnet.application.services;

import jakarta.ws.rs.core.Response;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.dtos.UserCreationRequestDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.UserFilterDTO;
import org.alumnet.application.mapper.UserMapper;
import org.alumnet.application.specifications.UserSpecification;
import org.alumnet.domain.User;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.infrastructure.config.KeycloakProperties;
import org.alumnet.infrastructure.exceptions.ExistingUserException;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private Keycloak keycloak;

    @Autowired
    private KeycloakProperties properties;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public ResultResponse<Void> createUser(UserCreationRequestDTO userCreationRequestDTO) throws ExistingUserException {
        try {
            if (isRegisteredUser(userCreationRequestDTO.getEmail()))
                throw new ExistingUserException(
                        "User with email " + userCreationRequestDTO.getEmail() + " already exists");

        } catch (Exception e) {
            System.out.println(e);
        }

        UserRepresentation userRepresentation = createUserRepresentation(userCreationRequestDTO);
        ResultResponse<Void> response = ResultResponse.<Void>builder().build();
        try (Response keycloakResponse = keycloak.realm(properties.getRealm()).users().create(userRepresentation)) {
            if (keycloakResponse.getStatus() != 201) {
                response.addError("Error creating userRepresentation: " + keycloakResponse.getStatus());
                return response;
            }
        }
        saveUser(userCreationRequestDTO);
        response.setMessage("Successfully created user");
        response.setSuccess(true);
        return response;
    }

    public Page<UserDTO> getUsers(UserFilterDTO filter, Pageable page) {
        boolean hasFilter = filter != null && (filter.getName() != null ||
                filter.getLastname() != null ||
                filter.getEmail() != null ||
                filter.getRole() != null);

        Page<User> userPage;

        if (!hasFilter) {
            userPage = userRepository.findAll(page);
        } else {
            Specification<User> userSpec = UserSpecification.byFilters(filter);
            userPage = userRepository.findAll(userSpec, page);
        }

        return userPage.map(userMapper::userToUserDTO);
    }

    private boolean isRegisteredUser(String email) {
        return userRepository.existsById(email)
                || !keycloak.realm(properties.getRealm()).users().searchByEmail(email, true).isEmpty();
    }

    private void saveUser(UserCreationRequestDTO userCreationRequestDTO) {
        User user = userMapper.userDTOToUserCreationRequest(userCreationRequestDTO);
        userRepository.save(user);
    }

    private UserRepresentation createUserRepresentation(UserCreationRequestDTO userCreationRequestDTO) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userCreationRequestDTO.getEmail());
        user.setEmail(userCreationRequestDTO.getEmail());
        user.setFirstName(userCreationRequestDTO.getName());
        user.setLastName(userCreationRequestDTO.getLastname());
        user.setEnabled(true);
        user.setGroups(List.of(userCreationRequestDTO.getGroup()));
        user.setEmailVerified(true);
        return user;
    }
}
