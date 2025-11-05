package org.alumnet.domain.events;

import jakarta.persistence.*;
import lombok.*;
import org.alumnet.domain.resources.TaskResource;
import org.alumnet.domain.users.Student;

import java.util.HashSet;
import java.util.Set;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventParticipation {
    @EmbeddedId
    private EventParticipationId id;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    @MapsId("eventId")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "student_email", referencedColumnName = "email")
    @MapsId("studentEmail")
    private Student student;

    private Double grade;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "resource_id", referencedColumnName = "id")
    private TaskResource resource;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL)
    private Set<QuestionnaireResponseDetail> responses = new HashSet<>();
}
