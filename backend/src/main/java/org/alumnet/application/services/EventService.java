package org.alumnet.application.services;


import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.AnswerDTO;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.QuestionDTO;
import org.alumnet.application.mapper.EventMapper;
import org.alumnet.domain.Section;
import org.alumnet.domain.events.Event;
import org.alumnet.domain.events.EventParticipation;
import org.alumnet.domain.events.EventParticipationId;
import org.alumnet.domain.repositories.EventParticipationRepository;
import org.alumnet.domain.repositories.EventRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.resources.TaskResource;
import org.alumnet.domain.users.Student;
import org.alumnet.infrastructure.exceptions.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EventService {

    private final CourseService courseService;
    private final SectionService sectionService;
    private final NotificationService notificationService;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final FileValidationService fileValidationService;
    private final EventParticipationRepository eventParticipationRepository;
    private final UserRepository userRepository;
    private final S3FileStorageService s3FileStorageService;
    
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

    public EventDTO getEventById(Integer eventId) {
        return eventMapper.eventToEventDTO(eventRepository.findById(eventId).orElseThrow(EventNotFoundException::new));
    }

    public void submitHomework(Integer eventId, MultipartFile homeworkFile, String studentEmail) {
        Event event = eventRepository.findById(eventId).orElseThrow(EventNotFoundException::new);
        if (LocalDateTime.now().isAfter(event.getEndDate()))
            throw new AssignmentDueDateExpiredException("No se puede enviar la tarea despues de la fecha de fin del evento");

        fileValidationService.validateFile(homeworkFile, false);

        Student student = userRepository.findById(studentEmail)
                .filter(user -> user instanceof Student)
                .map(user -> (Student) user).orElseThrow(UserNotFoundException::new);

        String s3Key = s3FileStorageService.store(homeworkFile, "courses/" + event.getSection().getCourseId() +
                "/sections/" + event.getSection().getTitle() +
                "/events/" + event.getId() +
                "/homeworks/" + student.getEmail());

        TaskResource submissionResource = TaskResource.builder()
                .url(s3Key)
                .extension(fileValidationService.getFileExtension(homeworkFile.getOriginalFilename()))
                .sizeInBytes(homeworkFile.getSize())
                .name(Objects.requireNonNull(homeworkFile.getOriginalFilename())
                        .substring(0, homeworkFile.getOriginalFilename().lastIndexOf('.')))
                .build();

        EventParticipation eventParticipation = EventParticipation.builder()
                .id(EventParticipationId.builder()
                        .eventId(event.getId())
                        .studentEmail(studentEmail)
                        .build())
                .event(event)
                .student(student)
                .resource(submissionResource)
                .build();

        submissionResource.setParticipation(eventParticipation);

        eventParticipationRepository.save(eventParticipation);

    }
}
