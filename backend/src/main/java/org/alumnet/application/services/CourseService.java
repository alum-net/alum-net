package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.*;
import org.alumnet.application.enums.UserRole;
import org.alumnet.application.mapper.CourseMapper;
import org.alumnet.application.mapper.UserMapper;
import org.alumnet.application.specifications.CourseSpecification;
import org.alumnet.application.specifications.UserSpecification;
import org.alumnet.domain.Course;
import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.CourseParticipationId;
import org.alumnet.domain.repositories.CourseParticipationRepository;
import org.alumnet.domain.repositories.CourseRepository;
import org.alumnet.domain.repositories.ParticipationRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.strategies.CourseContentStrategyFactory;
import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.Teacher;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.exceptions.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
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
                .map(user -> (Student)user)
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

    public Course findById(int courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new InvalidAttributeException("Curso con id " + courseId + " no encontrado"));
    }

    public Page<CourseDTO> getCourses(CourseFilterDTO filter, Pageable page) {
        boolean hasFilter = filter != null && (filter.getName() != null ||
                filter.getYear() != null ||
                filter.getTeacherEmail() != null ||
                filter.getShiftType() != null||
                filter.getUserEmail() != null);

        Page<Course> coursePage;

        if (!hasFilter) {
            coursePage = courseRepository.findAll(page);
        } else {
            Specification<Course> courseSpec = CourseSpecification.byFilters(filter);
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
        CourseContentDTO courseContent = courseContentStrategyFactory.getStrategy(user.getRole()).getCourseContent(userId, courseId, page);
        updateResourceUrls(courseContent);
        return courseContent;
    }

    private void updateResourceUrls(CourseContentDTO courseContent) {
        courseContent.getSections().getData().forEach(section -> section.getSectionResources().forEach(sectionResource
                -> sectionResource.setUrl(s3FileStorageService.generatePresignedUrl(sectionResource.getUrl(), Duration.ofHours(urlDuration)))));
    }
}
