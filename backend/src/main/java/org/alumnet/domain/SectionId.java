package org.alumnet.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SectionId implements Serializable {
    private String title;

    @Column(name = "course_id")
    private Integer courseId;
}
