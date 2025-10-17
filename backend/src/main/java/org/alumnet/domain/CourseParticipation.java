package org.alumnet.domain;

import jakarta.persistence.*;

@Entity
public class CourseParticipation extends Participation{
    @EmbeddedId
    private CourseParticipationId id;

    @ManyToOne
    @JoinColumn(name = "email")
    @MapsId("email")
    private Student student;
    @ManyToOne
    @JoinColumn(name = "id")
    @MapsId("id")
    private Course course;
}
