package org.alumnet.application.mapper;

import org.alumnet.application.dtos.AnswerDTO;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.QuestionDTO;
import org.alumnet.application.dtos.responses.EventDetailDTO;
import org.alumnet.application.dtos.responses.SummaryEventDTO;
import org.alumnet.application.enums.EventType;
import org.alumnet.domain.events.*;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EventMapper {

    Task eventDTOToTask(EventDTO task);

    OnSite eventDTOToOnSite(EventDTO onSite);

    Questionnaire eventDTOToQuestionnaire(EventDTO eventDTO);

    Question questionDTOToQuestion(QuestionDTO questionDTO);

    Answer answerDTOToAnswer(AnswerDTO answerDTO);

    QuestionDTO questionDTOToQuestionDTO(Question question);

    AnswerDTO answerDTOToAnswerDTO(Answer answer);

    EventDetailDTO eventToTaskDTO(Task task);

    EventDetailDTO eventToOnSiteDTO(OnSite onSite);

    @Mapping(target = "sectionId", source = "section.sectionId")
    EventDetailDTO eventToQuestionnaireDTO(Questionnaire questionnaire);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "type", ignore = true)
    SummaryEventDTO eventToSummaryEventDTO(Event event);

    default Event eventDTOToEvent(EventDTO eventDTO) {
        return switch (eventDTO.getType()) {
            case EventType.TASK -> eventDTOToTask(eventDTO);
            case EventType.ONSITE -> eventDTOToOnSite(eventDTO);
            case EventType.QUESTIONNAIRE -> eventDTOToQuestionnaire(eventDTO);
            default -> throw new IllegalArgumentException("Unknown role: " + eventDTO.getType());
        };
    }

    default EventDetailDTO eventToEventDTO(Event event) {
        return switch (event) {
            case Task task -> eventToTaskDTO(task);
            case OnSite onSite -> eventToOnSiteDTO(onSite);
            case Questionnaire questionnaire -> eventToQuestionnaireDTO(questionnaire);
            case null -> throw new IllegalArgumentException("Event cannot be null");
            default -> throw new IllegalArgumentException("Unknown event type: " + event.getClass().getName());
        };
    }

    @AfterMapping
    default void linkRelations(@MappingTarget Questionnaire questionnaire) {
        if (questionnaire.getQuestions() != null) {
            questionnaire.getQuestions().forEach(question -> {
                question.setQuestionnaire(questionnaire);
                if (question.getAnswers() != null) {
                    question.getAnswers().forEach(answer -> answer.setQuestion(question));
                }
            });
        }
    }

    @AfterMapping
    default void setEventType(@MappingTarget SummaryEventDTO dto, Event event) {
        String type = switch (event) {
            case Task task -> EventType.TASK.getValue();
            case OnSite onSite -> EventType.ONSITE.getValue();
            case Questionnaire questionnaire -> EventType.QUESTIONNAIRE.getValue();
            case null -> throw new IllegalArgumentException("Event cannot be null");
            default -> throw new IllegalArgumentException("Unknown event type: " + event.getClass().getName());
        };
        dto.setType(type);
    }
}
