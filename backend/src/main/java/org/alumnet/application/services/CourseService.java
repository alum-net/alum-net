package org.alumnet.application.services;

import com.opencsv.bean.CsvToBeanBuilder;
import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.*;
import org.alumnet.application.dtos.requests.CourseBulkCreationDTO;
import org.alumnet.application.dtos.requests.CourseCreationRequestDTO;
import org.alumnet.application.dtos.requests.CourseFilterDTO;
import org.alumnet.application.dtos.requests.UserFilterDTO;
import org.alumnet.application.dtos.responses.BulkCreationErrorDetailDTO;
import org.alumnet.application.dtos.responses.BulkCreationResponseDTO;
import org.alumnet.application.enums.ShiftType;
import org.alumnet.application.enums.UserRole;
import org.alumnet.application.mapper.CourseMapper;
import org.alumnet.application.mapper.UserMapper;
import org.alumnet.application.query_builders.CourseSpecification;
import org.alumnet.application.query_builders.UserSpecification;
import org.alumnet.domain.Course;
import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.alumnet.domain.repositories.CourseParticipationRepository;
import org.alumnet.domain.repositories.CourseRepository;
import org.alumnet.domain.repositories.ParticipationRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.strategies.CourseContentStrategyFactory;
import org.alumnet.domain.users.Administrator;
import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.Teacher;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.exceptions.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseParticipationRepository courseParticipationRepository;
    private final ParticipationRepository participationRepository;
    private final CourseContentStrategyFactory courseContentStrategyFactory;
    private final S3FileStorageService s3FileStorageService;
    @Value("${aws.s3.duration-url-hours}")
    private long urlDuration;

    private final CourseMapper courseMapper;

    private final UserMapper userMapper;

    public void create(CourseCreationRequestDTO courseCreationRequestDTO) {

        validateDates(courseCreationRequestDTO.getStartDate(), courseCreationRequestDTO.getEndDate());

        validateGrade(courseCreationRequestDTO.getApprovalGrade());

        List<Teacher> teachers = userRepository
                .findAllById(courseCreationRequestDTO.getTeachersEmails())
                .stream()
                .filter(user -> user instanceof Teacher)
                .map(user -> (Teacher) user)
                .collect(Collectors.toList());

        validateTeachers(courseCreationRequestDTO.getTeachersEmails(), teachers);

        Date startDate = Date.from(courseCreationRequestDTO.getStartDate()
                .atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(courseCreationRequestDTO.getEndDate()
                .atStartOfDay(ZoneId.systemDefault()).toInstant());

        Course course = Course.builder()
                .name(courseCreationRequestDTO.getName().trim())
                .description(courseCreationRequestDTO.getDescription().trim())
                .shift(courseCreationRequestDTO.getShift())
                .approvalGrade(courseCreationRequestDTO.getApprovalGrade())
                .startDate(startDate)
                .endDate(endDate)
                .enabled(true)
                .teachers(teachers)
                .build();

        courseRepository.save(course);
    }

    public void addMemberToCourse(int courseId, String studentEmail) {

        Student student = userRepository.findOne(UserSpecification.byFilters(UserFilterDTO.builder()
                .email(studentEmail)
                .role(UserRole.STUDENT).build()))
                .map(user -> (Student) user)
                .orElseThrow(UserNotFoundException::new);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(CourseNotFoundException::new);

        CourseParticipationId id = new CourseParticipationId(studentEmail, courseId);

        if (courseParticipationRepository.existsById(id)) {
            throw new AlreadyEnrolledStudentException();
        }

        CourseParticipation participation = CourseParticipation.builder()
                .id(id)
                .student(student)
                .course(course)
                .grade(null)
                .build();

        courseParticipationRepository.save(participation);
    }

    public void deleteCourse(int courseId) {
        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(CourseNotFoundException::new);

        boolean hasEnrolledStudents = participationRepository.hasEnrolledStudents(courseId);

        if (course.isEnabled() && hasEnrolledStudents) {
            throw new ActiveCourseException("El curso está activo y tiene estudiantes matriculados.");
        }

        course.setEnabled(false);
        courseRepository.save(course);
    }

    public void removeMemberFromCourse(Integer courseId, String userEmail) {
        CourseParticipation userParticipation = participationRepository
                .findById(CourseParticipationId.builder()
                        .studentEmail(userEmail)
                        .courseId(courseId)
                        .build())
                .orElseThrow(EnrollmentNotFoundException::new);

        participationRepository.delete(userParticipation);
    }

    public Course findById(int courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new InvalidAttributeException("Curso con id " + courseId + " no encontrado"));
    }

    public Page<CourseDTO> getCourses(CourseFilterDTO filter, Pageable page) {
        boolean hasFilter = filter != null && (filter.getName() != null ||
                filter.getYear() != null ||
                filter.getTeacherEmail() != null ||
                filter.getShift() != null ||
                filter.getUserEmail() != null);

        Page<Course> coursePage;

        if (!hasFilter) {
            Specification<Course> courseSpec = CourseSpecification.basic();
            coursePage = courseRepository.findAll(courseSpec, page);
        } else {
            UserRole userRole = null;
            if (filter != null && filter.getUserEmail() != null) {
                User user = userRepository.findById(filter.getUserEmail()).orElseThrow(UserNotFoundException::new);
                switch (user) {
                    case Administrator _ -> userRole = UserRole.ADMIN;
                    case Teacher _ -> userRole = UserRole.TEACHER;
                    case Student _ -> userRole = UserRole.STUDENT;
                    default ->
                        throw new IllegalArgumentException("Unknown User subclass: " + user.getClass().getName());
                }
                ;
            }

            Specification<Course> courseSpec = CourseSpecification.byFilters(filter, userRole);
            coursePage = courseRepository.findAll(courseSpec, page);
        }

        return coursePage.map(courseMapper::courseToCourseDTO);
    }

    public Page<UserDTO> getCourseMembers(int courseId, Pageable page) {
        Page<User> members = userRepository.findAll(UserSpecification.byCourse(courseId), page);
        return members.map(userMapper::userToUserDTO);
    }

    public CourseContentDTO getCourseContent(Pageable page, int courseId, String userId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        CourseContentDTO courseContent = courseContentStrategyFactory.getStrategy(user.getRole())
                .getCourseContent(userId, courseId, page);
        updateResourceUrls(courseContent);
        return courseContent;
    }

    public BulkCreationResponseDTO bulkCreateCourses(MultipartFile file, boolean hasHeaders) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo CSV no debe estar vacío.");
        }

        List<BulkCreationErrorDetailDTO> errors = new ArrayList<>();
        List<CourseBulkCreationDTO> bulkCreationList;
        int successfulCreations = 0;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)) {
            CsvToBeanBuilder<CourseBulkCreationDTO> builder = new CsvToBeanBuilder<CourseBulkCreationDTO>(reader)
                    .withType(CourseBulkCreationDTO.class)
                    .withSeparator(',');

            if (hasHeaders) {
                builder.withSkipLines(1);
            }
            bulkCreationList = builder.build().parse();
        } catch (Exception e) {
            throw new RuntimeException("Error fatal al leer o parsear el archivo CSV. Verifique el formato general del archivo.", e);
        }

        int initialLineNumber = hasHeaders ? 2 : 1;

        for (CourseBulkCreationDTO bulkDTO : bulkCreationList) {
            int currentLine = initialLineNumber++;
            String identifier = bulkDTO.getName() != null ? bulkDTO.getName().trim() : "Curso sin nombre";

            try {

                // Se replican las validaciones que se hacen en el endpoint atómico
                if (bulkDTO.getName() == null || bulkDTO.getName().trim().isEmpty()) {
                    throw new InvalidAttributeException("El nombre del curso no puede estar vacío");
                }
                if (bulkDTO.getDescription() == null || bulkDTO.getDescription().trim().isEmpty()) {
                    throw new InvalidAttributeException("La descripción del curso no puede estar vacía");
                }

                ShiftType validatedShift = getValidShift(bulkDTO.getShift());

                LocalDate startDate = parseDate(bulkDTO.getStartDate(), "Fecha de inicio");
                LocalDate endDate = parseDate(bulkDTO.getEndDate(), "Fecha de fin");

                List<String> teacherEmails = parseTeacherEmails(bulkDTO.getTeacherEmails());

                List<Teacher> teachers = userRepository
                        .findAllById(teacherEmails)
                        .stream()
                        .filter(user -> user instanceof Teacher)
                        .map(user -> (Teacher) user)
                        .collect(Collectors.toList());
                validateTeachers(teacherEmails, teachers);

                CourseCreationRequestDTO creationRequestDTO = new CourseCreationRequestDTO(
                        bulkDTO.getName(),
                        bulkDTO.getDescription(),
                        validatedShift,
                        bulkDTO.getApprovalGrade(),
                        startDate,
                        endDate,
                        teacherEmails
                );

                create(creationRequestDTO);
                successfulCreations++;

            } catch (InvalidAttributeException e) {
                errors.add(BulkCreationErrorDetailDTO.builder()
                        .lineNumber(currentLine)
                        .identifier(identifier)
                        .reason("Error de validación: " + e.getMessage())
                        .build());
            } catch (DateTimeParseException e) {
                errors.add(BulkCreationErrorDetailDTO.builder()
                        .lineNumber(currentLine)
                        .identifier(identifier)
                        .reason("Error de formato de fecha. Use YYYY-MM-DD.")
                        .build());
            } catch (Exception e) {
                errors.add(BulkCreationErrorDetailDTO.builder()
                        .lineNumber(currentLine)
                        .identifier(identifier)
                        .reason("Error desconocido al crear curso: " + e.getMessage())
                        .build());
            }
        }

        return BulkCreationResponseDTO.builder()
                .totalRecords(bulkCreationList.size())
                .successfulCreations(successfulCreations)
                .failedCreations(errors.size())
                .errors(errors)
                .build();
    }

    private List<String> parseTeacherEmails(String emailsString) {
        if (emailsString == null || emailsString.trim().isEmpty()) {
            throw new InvalidAttributeException("Debe asignarse al menos un docente");
        }

        List<String> emails = Arrays.stream(emailsString.split("\\|"))
                .map(String::trim)
                .filter(email -> !email.isEmpty())
                .collect(Collectors.toList());

        if (emails.isEmpty()) {
            throw new InvalidAttributeException("Debe asignarse al menos un docente");
        }

        for (String email : emails) {
            if (!isValidEmailFormat(email)) {
                throw new InvalidAttributeException("El email del docente '" + email + "' tiene un formato incorrecto.");
            }
        }

        return emails;
    }

    private LocalDate parseDate(String dateString, String fieldName) {
        if (dateString == null || dateString.trim().isEmpty()) {
            throw new InvalidAttributeException(fieldName + " no puede ser nula");
        }
        try {
            return LocalDate.parse(dateString.trim(), DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException e) {
            throw new DateTimeParseException("El campo '" + fieldName + "' tiene un formato inválido. Use YYYY-MM-DD.", dateString, e.getErrorIndex());
        }
    }

    private ShiftType getValidShift(String shift) {
        if (shift == null || shift.trim().isEmpty()) {
            throw new InvalidAttributeException("Debe seleccionarse un turno (Matutino, Vespertino o Nocturno)");
        }
        return switch (shift.trim().toUpperCase()) {
            case "NOCTURNO" -> ShiftType.EVENING;
            case "VESPERTINO" -> ShiftType.AFTERNOON;
            case "MATUTINO" -> ShiftType.MORNING;
            default -> throw new InvalidAttributeException("Turno inválido: " + shift +
                    ". Debe ser Matutino, Vespertino o Nocturno.");
        };
    }

    private boolean isValidEmailFormat(String email) {
        return email != null && email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }

    private void updateResourceUrls(CourseContentDTO courseContent) {
        courseContent.getSections().getData()
                .forEach(section -> section.getSectionResources()
                        .forEach(sectionResource -> sectionResource.setUrl(s3FileStorageService
                                .generatePresignedUrl(sectionResource.getUrl(), Duration.ofHours(urlDuration)))));
    }

    private void validateTeachers(List<String> teacherEmails, List<Teacher> teachers) {
        if (teachers.size() != teacherEmails.size()) {
            throw new InvalidAttributeException("Uno o más docentes no existen o no tienen rol Teacher");
        }
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (!startDate.isBefore(endDate)) {
            throw new InvalidAttributeException("La fecha de inicio debe ser anterior a la fecha de fin");
        }
    }

    private static void validateGrade(Double approvalGrade) {
        if (approvalGrade == null || approvalGrade < 0.0 || approvalGrade > 1.0) {
            throw new InvalidAttributeException("La nota mínima debe estar entre 0.0 y 1.0");
        }
    }

    public List<Student> findEnrolledStudentsInCourse(int id) {
        return participationRepository.findEnrolledStudentsByCourseId(id);
    }
}
