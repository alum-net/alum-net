package org.alumnet.application.query_builders;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Expression;
import org.alumnet.application.dtos.requests.CourseFilterDTO;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.Course;
import org.alumnet.domain.users.Teacher;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CourseSpecification {

    public static Specification<Course> basic() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("enabled"));
    }

    public static Specification<Course> byFilters(CourseFilterDTO filter, UserRole userRole) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getName() != null) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + filter.getName().toLowerCase() + "%"));
            }

            if (filter.getYear() != null) {
                Expression<Double> datePartResult = criteriaBuilder.function(
                        "DATE_PART",
                        Double.class,
                        criteriaBuilder.literal("year"),
                        root.get("startDate"));

                Expression<Integer> yearAsInteger = datePartResult.as(Integer.class);

                predicates.add(criteriaBuilder.equal(
                        yearAsInteger,
                        filter.getYear()));
            }

            if (filter.getShift() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("shift").as(String.class),
                        filter.getShift().name()));
            }

            if (filter.getTeacherEmail() != null) {
                Join<Course, Teacher> teacherJoin = root.join("teachers");

                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(teacherJoin.get("email")),
                        "%" + filter.getTeacherEmail().toLowerCase() + "%"));
            }

            if (filter.getUserEmail() != null) {

                if (userRole == UserRole.TEACHER) {
                    Join<Course, Teacher> teacherJoin = root.join("teachers");
                    predicates.add(criteriaBuilder.equal(
                            teacherJoin.get("email"),
                            filter.getUserEmail()));

                } else if (userRole == UserRole.STUDENT) {
                    Join participationJoin = root.join("participations");
                    Join studentJoin = participationJoin.join("student");

                    predicates.add(criteriaBuilder.equal(
                            studentJoin.get("email"),
                            filter.getUserEmail()));
                }
            }

            predicates.add(criteriaBuilder.isTrue(root.get("enabled")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
