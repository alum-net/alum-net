package org.alumnet.application.specifications;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.alumnet.application.dtos.CourseFilterDTO;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.Course;
import org.alumnet.domain.users.Teacher;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CourseSpecification {
    public static Specification<Course> byFilters(CourseFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getName() != null) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + filter.getName().toLowerCase() + "%"
                ));
            }

            if (filter.getYear() != null) {
                jakarta.persistence.criteria.Expression<Double> datePartResult = criteriaBuilder.function(
                        "DATE_PART",
                        Double.class,
                        criteriaBuilder.literal("year"),
                        root.get("startDate")
                );

                jakarta.persistence.criteria.Expression<Integer> yearAsInteger = datePartResult.as(Integer.class);

                predicates.add(criteriaBuilder.equal(
                        yearAsInteger,
                        filter.getYear()
                ));
            }

            if (filter.getShiftType() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("shift").as(String.class),
                        filter.getShiftType().name()
                ));
            }

            if (filter.getTeacherEmail() != null) {
                Join<Course, Teacher> teacherJoin = root.join("teachers");

                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(teacherJoin.get("email")),
                        "%" + filter.getTeacherEmail().toLowerCase() + "%"
                ));
            }

            if (filter.getUserEmail() != null && filter.getRole() != null) {

                if (filter.getRole() == UserRole.TEACHER) {
                    Join<Course, Teacher> teacherJoin = root.join("teachers");
                    predicates.add(criteriaBuilder.equal(
                            teacherJoin.get("email"),
                            filter.getUserEmail()
                    ));

                } else if (filter.getRole() == UserRole.STUDENT) {
                    Join participationJoin = root.join("participations");
                    Join studentJoin = participationJoin.join("student");

                    predicates.add(criteriaBuilder.equal(
                            studentJoin.get("email"),
                            filter.getUserEmail()
                    ));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
