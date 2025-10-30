package org.alumnet.domain.events;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipationId {
    @Column(name = "student_email")
    private String studentEmail;

    @Column(name = "event_id")
    private Integer eventId;
}
