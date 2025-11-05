package org.alumnet.application.services;

import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.requests.UserBulkCreationDTO;
import org.alumnet.application.dtos.requests.UserCreationRequestDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.requests.UserFilterDTO;
import org.alumnet.application.dtos.requests.UserModifyRequestDTO;
import org.alumnet.application.dtos.responses.BulkErrorDetailDTO;
import org.alumnet.application.dtos.responses.BulkResponseDTO;
import org.alumnet.application.dtos.responses.CalendarEventDetailDTO;
import org.alumnet.application.enums.UserRole;
import org.alumnet.application.mapper.UserMapper;
import org.alumnet.application.query_builders.UserSpecification;
import org.alumnet.domain.Section;
import org.alumnet.domain.events.Event;
import org.alumnet.domain.repositories.EventRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.users.Teacher;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.config.KeycloakProperties;
import org.alumnet.infrastructure.exceptions.ExistingUserException;
import org.alumnet.infrastructure.exceptions.NoPendingChangesException;
import org.alumnet.infrastructure.exceptions.UserNotFoundException;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final Keycloak keycloak;
    private final KeycloakProperties properties;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
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
                throw new ExistingUserException(
                        "Failed to create user in Keycloak: " + keycloakResponse.getStatusInfo().getReasonPhrase());
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

        return userPage.map(user -> {
            UserDTO dto = userMapper.userToUserDTO(user);
            if (user.getAvatarUrl() != null) {
                dto.setAvatarUrl(fileStorageService.generatePresignedUrl(
                        dto.getAvatarUrl()));
            }
            return dto;
        });
    }

    public UserDTO getUser(String userEmail) {
        return userRepository.findById(userEmail)
                .map(user -> {
                    UserDTO dto = userMapper.userToUserDTO(user);
                    if (user.getAvatarUrl() != null) {
                        dto.setAvatarUrl(fileStorageService.generatePresignedUrl(
                                dto.getAvatarUrl()));
                    }
                    return dto;
                })
                .orElseThrow(UserNotFoundException::new);
    }

    public BulkResponseDTO bulkCreateUsers(MultipartFile file, boolean hasHeaders) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo CSV no debe estar vacío.");
        }

        List<BulkErrorDetailDTO> errors = new ArrayList<>();
        List<UserBulkCreationDTO> bulkCreationList;
        int successfulCreations = 0;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)) {

            CsvToBeanBuilder<UserBulkCreationDTO> builder = new CsvToBeanBuilder<UserBulkCreationDTO>(reader)
                    .withType(UserBulkCreationDTO.class)
                    .withSeparator(',');
            if (hasHeaders) {
                builder.withSkipLines(1);
            }

            bulkCreationList = builder.build().parse();

        } catch (Exception e) {
            throw new RuntimeException("Error fatal al leer o parsear el archivo CSV.", e);
        }

        int initialLineNumber = hasHeaders ? 2 : 1;

        for (UserBulkCreationDTO bulkDTO : bulkCreationList) {
            int currentLine = initialLineNumber++; // Rastrea la línea original del archivo

            try {
                String initialPassword = getUsernamePartFromEmail(bulkDTO.getEmail());
                String keycloakGroup = getGroupFromGroupName(bulkDTO.getGroup());

                UserCreationRequestDTO creationRequestDTO = new UserCreationRequestDTO(
                        bulkDTO.getName(),
                        bulkDTO.getLastname(),
                        keycloakGroup,
                        bulkDTO.getEmail(),
                        initialPassword);

                createUser(creationRequestDTO);
                successfulCreations++;

            } catch (ExistingUserException e) {
                errors.add(BulkErrorDetailDTO.builder()
                        .lineNumber(currentLine)
                        .identifier(bulkDTO.getEmail())
                        .reason("El usuario ya existe en el sistema.")
                        .build());
            } catch (IllegalArgumentException e) {
                errors.add(BulkErrorDetailDTO.builder()
                        .lineNumber(currentLine)
                        .identifier(bulkDTO.getEmail())
                        .reason(e.getMessage())
                        .build());
            } catch (Exception e) {
                errors.add(BulkErrorDetailDTO.builder()
                        .lineNumber(currentLine)
                        .identifier(bulkDTO.getEmail())
                        .reason("Error desconocido al crear el usuario: " + e.getMessage())
                        .build());
            }
        }

        return BulkResponseDTO.builder()
                .totalRecords(bulkCreationList.size())
                .successfulRecords(successfulCreations)
                .failedRecords(errors.size())
                .errors(errors)
                .build();
    }

    public void modifyUser(String userEmail, UserModifyRequestDTO modifyRequest, MultipartFile userAvatar) {
        if (modifyRequest == null && userAvatar == null)
            throw new NoPendingChangesException();

        User user = userRepository.findById(userEmail).orElseThrow(UserNotFoundException::new);

        if (modifyRequest != null) {
            if (modifyRequest.getName() != null)
                user.setName(modifyRequest.getName());
            if (modifyRequest.getLastname() != null)
                user.setLastname(modifyRequest.getLastname());
        }

        if (userAvatar != null) {
            fileValidationService.validateFile(userAvatar, true);
            String userAvatarFolder = "users/" + userEmail + "/avatar/";

            if (user.getAvatarUrl() != null)
                fileStorageService.deleteMultipleFile(user.getAvatarUrl());
            fileStorageService.store(userAvatar, userAvatarFolder);

            user.setAvatarUrl(userAvatarFolder + userAvatar.getOriginalFilename());
        }

        userRepository.save(user);
    }

    private String getUsernamePartFromEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido o formato incorrecto para generación de contraseña.");
        }

        return email.substring(0, email.indexOf("@"));
    }

    private String getGroupFromGroupName(String groupName) {
        if (groupName == null || groupName.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del grupo no puede estar vacío.");
        }

        return switch (groupName.trim().toUpperCase()) {
            case "ADMINISTRADORES" -> "admins";
            case "PROFESORES" -> "teachers";
            case "ESTUDIANTES" -> "students";
            default -> throw new IllegalArgumentException("Grupo no válido: " + groupName +
                    ". Debe ser 'Administradores', 'Profesores' o 'Estudiantes'.");
        };
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

    public List<CalendarEventDetailDTO> getCalendarEvents(LocalDateTime since, LocalDateTime to, String userEmail) {
        User currentUser = userRepository.findById(userEmail)
                .orElseThrow(UserNotFoundException::new);

        UserRole userRole = currentUser.getRole();

        List<Event> events;

        switch (userRole){
            case UserRole.STUDENT -> {
                events = eventRepository.findEventsByStudentEmailAndDates(
                        userEmail, since, to
                );
                break;
            }
            case UserRole.TEACHER -> {
                events = eventRepository.findEventsByTeacherEmailAndDates(
                        userEmail, since, to
                );
                break;
            }
            default -> throw new RuntimeException("Error al conseguir el rol");
        }

        return events.stream().map(e -> CalendarEventDetailDTO
                .builder()
                .eventId(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .type(e.getType())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .courseId(e.getSection().getCourseId())
                .courseName(e.getSection().getCourse().getName())
                .build()).collect(Collectors.toList());
    }
}
