package org.alumnet.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseParticipationId implements Serializable {
    @Column(name = "student_email")
    private String studentEmail;

    @Column(name = "course_id")
    private Integer courseId;
}
