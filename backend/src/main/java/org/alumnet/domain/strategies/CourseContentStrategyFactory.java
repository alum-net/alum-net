package org.alumnet.domain.strategies;

import org.alumnet.application.enums.UserRole;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CourseContentStrategyFactory {

    private final Map<UserRole, CourseContentStrategy> strategies;

    public CourseContentStrategyFactory(TeacherCourseContentStrategy teacherStrategy,
                                        StudentCourseContentStrategy studentStrategy,
                                        AdminCourseContentStrategy adminStrategy) {

        this.strategies = Map.of(
                UserRole.TEACHER, teacherStrategy,
                UserRole.STUDENT, studentStrategy,
                UserRole.ADMIN, adminStrategy
        );
    }

    public CourseContentStrategy getStrategy(UserRole role) {
        CourseContentStrategy strategy = strategies.get(role);

        if (strategy == null) {
            throw new IllegalArgumentException("No strategy found for role: " + role);
        }

        return strategy;
    }
}
