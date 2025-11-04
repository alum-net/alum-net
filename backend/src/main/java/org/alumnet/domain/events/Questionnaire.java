package org.alumnet.domain.events;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
import org.alumnet.application.enums.EventType;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@DiscriminatorValue("questionnaire")
public class Questionnaire extends Event {

    private Integer durationInMinutes;

    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Question> questions = new HashSet<>();

    @Override
    public EventType getType(){
        return EventType.QUESTIONNAIRE;
    }
}
