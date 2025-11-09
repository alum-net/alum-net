package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.enums.UserRole;
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

        if (!isValidTeacherStudentPair(firstUser.getRole(), secondUser.getRole())) {
            return false;
        }

        return doUsersShareActiveCourse(firstUser, secondUser);
    }

    private boolean isValidTeacherStudentPair(UserRole firstUser, UserRole secondUser) {
        return (firstUser.equals(UserRole.TEACHER) && secondUser.equals(UserRole.STUDENT)) ||
                (firstUser.equals(UserRole.STUDENT) && secondUser.equals(UserRole.TEACHER));
    }

    private boolean doUsersShareActiveCourse(User firstUser, User secondUser) {
        Set<Integer> firstUserActiveCourseIds = getActiveCoursesForUser(firstUser);
        Set<Integer> secondUserActiveCourseIds = getActiveCoursesForUser(secondUser);

        return !Collections.disjoint(firstUserActiveCourseIds, secondUserActiveCourseIds);
    }

    private Set<Integer> getActiveCoursesForUser(User user) {
        if (user.getRole().equals(UserRole.TEACHER)) {
            return getActiveCoursesForTeacher((Teacher)  user);
        } else if (user.getRole().equals(UserRole.STUDENT)) {
            return getActiveCoursesForStudent((Student) user);
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
        return participationRepository.findActiveCourseIdsByStudentEmail(student.getEmail());
    }
}
