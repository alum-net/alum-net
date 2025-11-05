package org.alumnet.domain.events;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import org.alumnet.application.enums.EventType;

@Getter
@Setter
@Entity
@DiscriminatorValue("on-site")
public class OnSite extends Event{
    @Override
    public EventType getType(){
        return EventType.ONSITE;
    }
}
