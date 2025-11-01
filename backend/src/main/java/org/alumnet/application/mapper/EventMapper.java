package org.alumnet.application.mapper;

import org.alumnet.application.dtos.AnswerDTO;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.QuestionDTO;
import org.alumnet.domain.events.Answer;
import org.alumnet.domain.events.Question;
import org.alumnet.domain.events.Event;
import org.alumnet.domain.events.OnSite;
import org.alumnet.domain.events.Questionnaire;
import org.alumnet.domain.events.Task;
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

    EventDTO eventToTaskDTO(Task task);
    EventDTO eventToOnSiteDTO(OnSite onSite);
    @Mapping(target = "sectionId", source = "section.sectionId")
    EventDTO eventToQuestionnaireDTO(Questionnaire questionnaire);

    default Event eventDTOToEvent(EventDTO eventDTO) {
        return switch (eventDTO.getType()) {
            case "task" -> eventDTOToTask(eventDTO);
            case "on-site" -> eventDTOToOnSite(eventDTO);
            case "questionnaire" -> eventDTOToQuestionnaire(eventDTO);
            default -> throw new IllegalArgumentException("Unknown role: " + eventDTO.getType());
        };
    }
    default EventDTO eventToEventDTO(Event event) {
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
}
