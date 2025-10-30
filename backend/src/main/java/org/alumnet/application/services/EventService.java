package org.alumnet.application.services;


import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.AnswerDTO;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.QuestionDTO;
import org.alumnet.application.mapper.EventMapper;
import org.alumnet.domain.Answer;
import org.alumnet.domain.Question;
import org.alumnet.domain.Section;
import org.alumnet.domain.events.Event;
import org.alumnet.domain.events.EventParticipation;
import org.alumnet.domain.events.EventParticipationId;
import org.alumnet.domain.events.Questionnaire;
import org.alumnet.domain.repositories.EventRepository;
import org.alumnet.domain.users.Student;
import org.alumnet.infrastructure.exceptions.InvalidAttributeException;
import org.alumnet.infrastructure.exceptions.QuestionnaireValidationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final CourseService courseService;
    private final SectionService sectionService;
    private final NotificationService notificationService;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    public void createEvent(EventDTO eventDTO) {
        validateDates(eventDTO.getStartDate(),eventDTO.getEndDate());

        if ("questionnaire".equals(eventDTO.getType()))
            validateQuestions(eventDTO.getQuestions());

        Section section = sectionService.findSectionById(eventDTO.getSectionId());
        List<Student> enrolledStudentsInCourse = courseService.
                findEnrolledStudentsInCourse(section.getCourse().getId());

        String notificationID = notificationService.sendNotifications(
                eventDTO.getTitle(),
                eventDTO.getDescription(),
                enrolledStudentsInCourse.stream()
                        .map(Student::getEmail)
                        .toList(),
                eventDTO.getEndDate()
        );

        Event event = eventMapper.eventDTOToEvent(eventDTO);
        event.setSection(section);
        event.setNotificationId(notificationID);
        event.setParticipation(enrollStudentsInEvent(event, enrolledStudentsInCourse));


        eventRepository.save(event);

    }

    private List<EventParticipation> enrollStudentsInEvent(Event event, List<Student> students) {

        return students.stream()
                .map(student -> EventParticipation.builder()
                        .id(EventParticipationId.builder()
                                .eventId(null)
                                .studentEmail(student.getEmail())
                                .build())
                        .event(event)
                        .student(student)
                        .grade(null)
                        .build())
                .toList();
    }
    
    private void validateQuestions(List<QuestionDTO> questions) {
        if (questions == null || questions.isEmpty())
            throw new QuestionnaireValidationException("Un cuestionario debe tener al menos una pregunta");
        questions.forEach(question -> {
            if (question.getText() == null || question.getText().isBlank())
                throw new QuestionnaireValidationException("El texto de la pregunta no puede ser nulo o vacío");
            validateAnswers(question.getAnswers());

        });
    }

    private void validateAnswers(List<AnswerDTO> answers) {
        if (answers == null || answers.size() < 2)
            throw new QuestionnaireValidationException("Cada pregunta debe tener al menos dos respuestas");
        answers.forEach(answer -> {
            if (answer.getText() == null || answer.getText().isBlank())
                throw new QuestionnaireValidationException("El texto de la respuesta no puede ser nulo o vacío");
        });
        if (answers.stream().noneMatch(AnswerDTO::isCorrect))
            throw new QuestionnaireValidationException("Cada pregunta debe tener al menos una respuesta correcta");
    }

    private void validateDates(LocalDateTime startDate, LocalDateTime endDate) {
        if (endDate.isBefore(LocalDateTime.now()))
            throw new InvalidAttributeException("La fecha de fin debe ser posterior a la fecha actual");
        if (endDate.isBefore(startDate))
            throw new InvalidAttributeException("La fecha de inicio debe ser anterior a la fecha de fin");

    }
}
