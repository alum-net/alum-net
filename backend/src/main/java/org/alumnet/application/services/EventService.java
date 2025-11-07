package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.*;
import org.alumnet.application.dtos.requests.SubmitQuestionnaireRequestDTO;
import org.alumnet.application.dtos.responses.EventDetailDTO;
import org.alumnet.application.enums.ActivityType;
import org.alumnet.application.enums.EventType;
import org.alumnet.application.enums.UserRole;
import org.alumnet.application.mapper.EventMapper;
import org.alumnet.domain.Section;
import org.alumnet.domain.events.*;
import org.alumnet.domain.repositories.*;
import org.alumnet.domain.resources.TaskResource;
import org.alumnet.domain.users.Student;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.exceptions.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

	private final CourseService courseService;
	private final SectionService sectionService;
	private final QuestionnaireResponseDetailRepository responseDetailRepository;
	private final EventParticipationRepository participationRepository;
	private final NotificationService notificationService;
	private final EventRepository eventRepository;
	private final EventMapper eventMapper;
	private final FileValidationService fileValidationService;
	private final EventParticipationRepository eventParticipationRepository;
	private final UserRepository userRepository;
	private final S3FileStorageService s3FileStorageService;
	private final UserActivityLogService activityLogService;

	public void createEvent(EventDTO eventDTO) {
		validateDates(eventDTO.getStartDate(), eventDTO.getEndDate());

		if (eventDTO.getType() == EventType.QUESTIONNAIRE)
			validateQuestions(eventDTO.getQuestions());

		Section section = sectionService.findSectionById(eventDTO.getSectionId());
		List<Student> enrolledStudentsInCourse = courseService
				.findEnrolledStudentsInCourse(section.getCourse().getId());

		Event event = eventMapper.eventDTOToEvent(eventDTO);
		event.setSection(section);
		event.setParticipation(enrollStudentsInEvent(event, enrolledStudentsInCourse));

		eventRepository.save(event);

		String notificationID = notificationService.sendNotifications(
				event.getId(),
				"Se acerca la fecha limite de un" + eventDTO.mapType(),
				eventDTO.getTitle(),
				enrolledStudentsInCourse.stream()
						.map(Student::getEmail)
						.toList(),
				eventDTO.getEndDate().minusDays(1));

		event.setNotificationId(notificationID);
		eventRepository.save(event);
	}

	public void deleteEvent(int eventId) {
		boolean hasParticipations = someParticipationByEventId(eventId);

		if (hasParticipations)
			throw new EventHasParticipationException();

		Event event = eventRepository.findById(eventId)
				.orElseThrow(EventNotFoundException::new);

		eventRepository.delete(event);

		notificationService.cancelScheduledNotification(eventId, event.getNotificationId());
	}

	private boolean someParticipationByEventId(int eventId) {
		return eventRepository.someParticipationByEventId(eventId);
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
		if (startDate.isBefore(LocalDateTime.now()))
			throw new InvalidAttributeException("La fecha de inicio debe ser posterior a la fecha actual");
		if (endDate.isBefore(startDate))
			throw new InvalidAttributeException("La fecha de inicio debe ser anterior a la fecha de fin");

	}

	public EventDetailDTO getEventById(Integer eventId) {
		Event event = eventRepository.findById(eventId).orElseThrow(EventNotFoundException::new);
		EventDetailDTO eventDetailDTO = eventMapper.eventToEventDTO(event);
		eventDetailDTO.setStudentsWithPendingSubmission(
				userRepository.findStudentsWithPendingSubmission(eventId, event.getSection().getCourseId()));
		return eventDetailDTO;
	}

	public void submitHomework(Integer eventId, MultipartFile homeworkFile, String studentEmail) {
		Event event = eventRepository.findById(eventId).orElseThrow(EventNotFoundException::new);
		if (LocalDateTime.now().isAfter(event.getEndDate()))
			throw new AssignmentDueDateExpiredException(
					"No se puede enviar la tarea despues de la fecha de fin del evento");

		fileValidationService.validateFile(homeworkFile, false);

		validateHomeworkAlreadySubmitted(eventId, studentEmail);

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

		activityLogService.logActivity(
				studentEmail,
				ActivityType.TASK_SUBMISSION,
				"Entrega de tarea: " + event.getTitle(),
				eventId.toString());
	}

	private void validateHomeworkAlreadySubmitted(Integer eventId, String studentEmail) {
		eventParticipationRepository.findById(EventParticipationId.builder()
				.eventId(eventId)
				.studentEmail(studentEmail)
				.build())
				.ifPresent(participation -> {
					if (participation.getResource() != null)
						throw new HomeworkAlreadySubmittedException(
								"El estudiante ya ha enviado la tarea para este evento");
				});
	}

	public EventDTO getQuestionnaireDetails(Integer eventId, String userEmail) {
		Questionnaire questionnaire = eventRepository.findQuestionnaireById(eventId)
				.orElseThrow(EventNotFoundException::new);

		User user = userRepository.findById(userEmail)
				.orElseThrow(UserNotFoundException::new);

		EventDTO.EventDTOBuilder<?, ?> eventDTOBuilder = EventDTO.builder()
				.title(questionnaire.getTitle())
				.description(questionnaire.getDescription())
				.type(questionnaire.getType())
				.startDate(questionnaire.getStartDate())
				.endDate(questionnaire.getEndDate())
				.durationInMinutes(questionnaire.getDurationInMinutes())
				.maxGrade(questionnaire.getMaxGrade())
				.questions(questionnaire.getQuestions().stream()
						.map(eventMapper::questionDTOToQuestionDTO)
						.collect(Collectors.toList()));

		if (user.getRole() == UserRole.TEACHER) {
			// Si es el teacher el que pregunta me traigo también todas las respuestas
			Set<QuestionnaireResponseDetail> allResponses = responseDetailRepository
					.findAllResponsesByEventId(eventId);

			Map<EventParticipation, List<QuestionResponseDTO>> groupedResponses = generateGroupedResponses(
					allResponses);

			List<QuestionnaireResponseDTO> teacherResponsesDTO = generateQuestionnaireResponses(groupedResponses);

			eventDTOBuilder.responses(teacherResponsesDTO);
		}

		return eventDTOBuilder.build();
	}

	private List<QuestionnaireResponseDTO> generateQuestionnaireResponses(
			Map<EventParticipation, List<QuestionResponseDTO>> groupedResponses) {
		return groupedResponses.entrySet().stream()
				.map(entry -> {
					EventParticipation attempt = entry.getKey();
					List<QuestionResponseDTO> responses = entry.getValue();

					return QuestionnaireResponseDTO.builder()
							.studentEmail(attempt.getStudent().getEmail())
							.name(attempt.getStudent().getName())
							.responses(responses)
							.build();
				})
				.collect(Collectors.toList());
	}

	private Map<EventParticipation, List<QuestionResponseDTO>> generateGroupedResponses(
			Set<QuestionnaireResponseDetail> allResponses) {
		Map<EventParticipation, List<QuestionResponseDTO>> groupedResponses = allResponses.stream()
				.collect(Collectors.groupingBy(
						QuestionnaireResponseDetail::getAttempt,
						Collectors.mapping(
								r -> QuestionResponseDTO.builder()
										.questionId(r.getQuestion().getId())
										.answerId(r.getStudentAnswer() != null ? r.getStudentAnswer().getId() : null)
										.isCorrect(r.getStudentAnswer().getCorrect())
										.timeStamp(r.getAttemptDate())
										.build(),
								Collectors.toList())));
		return groupedResponses;
	}

	public void submitQuestionnaireResponses(SubmitQuestionnaireRequestDTO request, Integer eventId) {
		Student student = (Student) userRepository.findById(request.getUserEmail())
				.orElseThrow(UserNotFoundException::new);

		if (request.getResponses().isEmpty()) {
			throw new InvalidSubmissionException("No se enviaron respuestas.");
		}

		Questionnaire questionnaire = eventRepository.findQuestionnaireById(eventId)
				.orElseThrow(EventNotFoundException::new);

		EventParticipation participation = getOrCreateParticipation(student, questionnaire);
		Set<QuestionnaireResponseDetail> newResponses = new HashSet<>();

		for (Question question : questionnaire.getQuestions()) {
			var responseDetailBuilder = QuestionnaireResponseDetail
					.builder()
					.attempt(participation)
					.question(question);

			request.getResponses().stream()
					.filter(r -> Objects.equals(r.getQuestionId(), question.getId()))
					.findFirst()
					.ifPresent(response -> responseDetailBuilder
							.attemptDate(response.getTimeStamp())
							.studentAnswer(question.getAnswers().stream()
									.filter(a -> Objects.equals(a.getId(), response.getAnswerId()))
									.findFirst().orElse(null)));

			QuestionnaireResponseDetail responseDetail = responseDetailBuilder.build();

			newResponses.add(responseDetail);
		}
		participation.setResponses(newResponses);
		participationRepository.save(participation);

		activityLogService.logActivity(
				request.getUserEmail(),
				ActivityType.QUESTIONNAIRE_RESOLUTION,
				"Cuestionario resuelto: " + questionnaire.getTitle(),
				eventId.toString());
	}

	private EventParticipation getOrCreateParticipation(Student student, Questionnaire questionnaire) {
		EventParticipationId id = EventParticipationId.builder()
				.eventId(questionnaire.getId())
				.studentEmail(student.getEmail())
				.build();

		return participationRepository.findById(id)
				.orElseGet(() -> EventParticipation.builder()
						.id(id)
						.event(questionnaire)
						.student(student)
						.responses(new HashSet<>())
						.build());
	}
}
