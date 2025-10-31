package org.alumnet.application.mapper;

import org.alumnet.application.dtos.AnswerDTO;
import org.alumnet.application.dtos.EventDTO;
import org.alumnet.application.dtos.QuestionDTO;
import org.alumnet.domain.Answer;
import org.alumnet.domain.Question;
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

    default Event eventDTOToEvent(EventDTO eventDTO) {
        return switch (eventDTO.getType()) {
            case "task" -> eventDTOToTask(eventDTO);
            case "on-site" -> eventDTOToOnSite(eventDTO);
            case "questionnaire" -> eventDTOToQuestionnaire(eventDTO);
            default -> throw new IllegalArgumentException("Unknown role: " + eventDTO.getType());
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
