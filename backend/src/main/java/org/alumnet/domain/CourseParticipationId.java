package org.alumnet.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseParticipationId implements Serializable {
    @Column(name = "student_email")
    private String studentEmail;

    @Column(name = "course_id")
    private Integer courseId;
}
