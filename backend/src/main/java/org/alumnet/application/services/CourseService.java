package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.CourseCreationRequestDTO;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.*;
import org.alumnet.domain.repositories.CourseParticipationRepository;
import org.alumnet.domain.repositories.CourseRepository;
import org.alumnet.domain.repositories.ParticipationRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.infrastructure.exceptions.AlreadyEnrolledStudentException;
import org.alumnet.infrastructure.exceptions.CourseNotFoundException;
import org.alumnet.infrastructure.exceptions.ActiveCourseException;
import org.alumnet.infrastructure.exceptions.InvalidAttributeException;
import org.alumnet.infrastructure.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        Student student = userRepository.findStudentByEmail(studentEmail)
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
  
    @Transactional
    public void deleteCourse(int courseId) {
        boolean courseActive = courseRepository.isCourseActive(courseId);
        boolean hasEnrolledStudents = participationRepository.hasEnrolledStudents(courseId);

        if (courseActive && hasEnrolledStudents) {
            throw new ActiveCourseException("El curso está activo y tiene estudiantes matriculados.");
        }

        courseRepository.deactivateCourse(courseId);
    }

    private static void validateTeachers(List<String> teacherEmails, List<Teacher> teachers) {
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
}
