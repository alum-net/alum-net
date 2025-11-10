package org.alumnet.application.services;

import lombok.extern.slf4j.Slf4j;
import org.alumnet.application.dtos.StudentSubmissionDTO;
import org.alumnet.infrastructure.exceptions.InvalidSubmissionException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Slf4j
public class GradeSubmissionService {

    public <T> void gradeStudents(
            List<T> participations,
            List<StudentSubmissionDTO> studentSubmissions,
            Function<T, String> emailExtractor,
            BiConsumer<T, Double> gradeSetter,
            String context) {


        Set<String> studentEmails = studentSubmissions.stream()
                .map(StudentSubmissionDTO::getEmail)
                .collect(Collectors.toSet());

        Set<String> enrolledEmails = participations.stream()
                .map(emailExtractor)
                .collect(Collectors.toSet());

        validateAllStudentsToGrade(enrolledEmails, studentEmails, context);


        Map<String, Double> gradesByEmail = studentSubmissions.stream()
                .collect(Collectors.toMap(
                        StudentSubmissionDTO::getEmail,
                        StudentSubmissionDTO::getGrade
                ));

        participations.forEach(participation -> {
            String email = emailExtractor.apply(participation);
            Double grade = gradesByEmail.get(email);
            gradeSetter.accept(participation, grade);
        });

        log.info("Successfully graded {} students in {}", participations.size(), context);
    }

    private void validateAllStudentsToGrade(Set<String> enrolledEmails,
                                            Set<String> studentEmails,
                                            String context) {

        if (enrolledEmails.size() != studentEmails.size()) {
            throw new InvalidSubmissionException(
                    String.format("Debes calificar a todos los estudiantes inscritos. " +
                                    "Inscritos: %d, Calificaciones enviadas: %d",
                            enrolledEmails.size(),
                            studentEmails.size())
            );
        }

        Set<String> notEnrolled = studentEmails.stream()
                .filter(email -> !enrolledEmails.contains(email))
                .collect(Collectors.toSet());

        if (!notEnrolled.isEmpty()) {
            throw new InvalidSubmissionException(
                    String.format("Estudiantes no inscritos en el %s: %s", context, notEnrolled)
            );
        }
    }
}
