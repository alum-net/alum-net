package org.alumnet.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class CourseParticipationId {
    private String email;
    private int id;
}
