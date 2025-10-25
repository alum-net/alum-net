package org.alumnet.application.query_builders;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.alumnet.application.dtos.requests.UserFilterDTO;
import org.alumnet.domain.Course;
import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.users.Administrator;
import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.Teacher;
import org.alumnet.domain.users.User;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<User> byFilters(UserFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getName() != null) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + filter.getName().toLowerCase() + "%"
                ));
            }

            if (filter.getLastname() != null) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("lastname")),
                        "%" + filter.getLastname().toLowerCase() + "%"
                ));
            }

            if (filter.getEmail() != null) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")),
                        "%" + filter.getEmail().toLowerCase() + "%"
                ));
            }

            if (filter.getRole() != null) {

                Class<? extends User> targetClass = switch (filter.getRole()) {
                    case ADMIN -> Administrator.class;
                    case TEACHER -> Teacher.class;
                    case STUDENT -> Student.class;
                };

                predicates.add(criteriaBuilder.equal(root.type(), targetClass));
            }

            predicates.add(criteriaBuilder.isTrue(root.get("enabled")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<User> byCourse(int courseId){
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);

            Join<Teacher, Course> teacherCoursesJoin = criteriaBuilder.treat(root, Teacher.class)
                    .join("courses", JoinType.LEFT);

            Predicate isTeacher = criteriaBuilder.equal(
                    teacherCoursesJoin.get("id"),
                    courseId
            );
            Join<Student, CourseParticipation> studentParticipationsJoin = criteriaBuilder.treat(root, Student.class)
                    .join("participations" , JoinType.LEFT);

            Predicate isStudent = criteriaBuilder.equal(
                    studentParticipationsJoin.get("id").get("courseId"),
                    courseId
            );

            return criteriaBuilder.and(criteriaBuilder.or(isTeacher, isStudent), criteriaBuilder.isTrue(root.get("enabled")));
        };
    }
}