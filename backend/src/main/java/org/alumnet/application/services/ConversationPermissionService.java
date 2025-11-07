package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.domain.Course;
import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.repositories.CourseParticipationRepository;
import org.alumnet.domain.repositories.CourseRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.Teacher;
import org.alumnet.domain.users.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationPermissionService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseParticipationRepository participationRepository;

    public boolean canCommunicate(String firstUserEmail, String secondUserEmail) {
        if (firstUserEmail.equals(secondUserEmail)) {
            return false;
        }

        User firstUser = userRepository.findById(firstUserEmail).orElse(null);
        User secondUser = userRepository.findById(secondUserEmail).orElse(null);

        if (firstUser == null || secondUser == null) {
            return false;
        }

        if (!isValidTeacherStudentPair(firstUser, secondUser)) {
            return false;
        }

        return doUsersShareActiveCourse(firstUser, secondUser);
    }

    private boolean isValidTeacherStudentPair(User firstUser, User secondUser) {
        return (firstUser instanceof Teacher && secondUser instanceof Student) ||
                (firstUser instanceof Student && secondUser instanceof Teacher);
    }

    private boolean doUsersShareActiveCourse(User firstUser, User secondUser) {
        Set<Integer> firstUserActiveCourseIds = getActiveCoursesForUser(firstUser);
        Set<Integer> secondUserActiveCourseIds = getActiveCoursesForUser(secondUser);

        return !Collections.disjoint(firstUserActiveCourseIds, secondUserActiveCourseIds);
    }

    private Set<Integer> getActiveCoursesForUser(User user) {
        if (user instanceof Teacher teacher) {
            return getActiveCoursesForTeacher(teacher);
        } else if (user instanceof Student student) {
            return getActiveCoursesForStudent(student);
        }
        return Set.of();
    }

    private Set<Integer> getActiveCoursesForTeacher(Teacher teacher) {
        List<Integer> teacherCourseIds = courseRepository.findCourseIdsByTeacherEmail(teacher.getEmail());

        if (teacherCourseIds.isEmpty()) {
            return Set.of();
        }

        return courseRepository.findAllById(teacherCourseIds).stream()
                .filter(Course::isEnabled)
                .map(Course::getId)
                .collect(Collectors.toSet());
    }

    private Set<Integer> getActiveCoursesForStudent(Student student) {
        List<CourseParticipation> studentParticipations =
                participationRepository.findByStudentEmail(student.getEmail());

        return studentParticipations.stream()
                .map(CourseParticipation::getCourse)
                .filter(Objects::nonNull)
                .filter(Course::isEnabled)
                .map(Course::getId)
                .collect(Collectors.toSet());
    }
}
