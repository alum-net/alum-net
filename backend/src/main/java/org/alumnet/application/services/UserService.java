package org.alumnet.application.services;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.requests.UserCreationRequestDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.requests.UserFilterDTO;
import org.alumnet.application.dtos.requests.UserModifyRequestDTO;
import org.alumnet.application.mapper.UserMapper;
import org.alumnet.application.query_builders.UserSpecification;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.config.KeycloakProperties;
import org.alumnet.infrastructure.exceptions.ExistingUserException;
import org.alumnet.infrastructure.exceptions.NoPendingChangesException;
import org.alumnet.infrastructure.exceptions.UserNotFoundException;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final Keycloak keycloak;
    private final KeycloakProperties properties;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final S3FileStorageService fileStorageService;
    private final FileValidationService fileValidationService;

    public void createUser(UserCreationRequestDTO userCreationRequestDTO) throws ExistingUserException {
        try {
            if (isRegisteredUser(userCreationRequestDTO.getEmail()))
                throw new ExistingUserException(
                        "User with email " + userCreationRequestDTO.getEmail() + " already exists");

        } catch (Exception e) {
            System.out.println(e);
        }

        UserRepresentation userRepresentation = createUserRepresentation(userCreationRequestDTO);
        try (Response keycloakResponse = keycloak.realm(properties.getRealm()).users().create(userRepresentation)) {
            if (keycloakResponse.getStatus() != 201) {
                throw new ExistingUserException("Failed to create user in Keycloak: " + keycloakResponse.getStatusInfo().getReasonPhrase());
            }
        }
        saveUser(userCreationRequestDTO);

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

    public UserDTO getUser(String userEmail){
        return userRepository.findById(userEmail)
                .map(userMapper::userToUserDTO)
                .orElseThrow(UserNotFoundException::new);
    }

    public void modifyUser(String userEmail, UserModifyRequestDTO modifyRequest, MultipartFile userAvatar) {
        if(modifyRequest == null && userAvatar == null) throw new NoPendingChangesException();

        User user = userRepository.findById(userEmail).orElseThrow(UserNotFoundException::new);

        if(modifyRequest != null)
        {
            if(modifyRequest.getName() != null) user.setName(modifyRequest.getName());
            if(modifyRequest.getLastname() != null) user.setLastname(modifyRequest.getLastname());
        }

        if (userAvatar != null) {
            fileValidationService.validateFile(userAvatar, true);
            String userAvatarFolder = "users/" + userEmail + "/avatar/";

            if(user.getAvatarUrl() != null) fileStorageService.deleteMultipleFile(user.getAvatarUrl());
            fileStorageService.store(userAvatar, userAvatarFolder);

            user.setAvatarUrl(userAvatarFolder + userAvatar.getOriginalFilename());
        }

        userRepository.save(user);
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

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(userCreationRequestDTO.getPassword());
        credential.setTemporary(false);

        user.setCredentials(Collections.singletonList(credential));
        return user;
    }

}
