package org.alumnet.domain.resources;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.alumnet.domain.Section;

@Entity
@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("section")
public class SectionResource extends Resource {
    private String title;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "section_course_id", referencedColumnName = "course_id"),
            @JoinColumn(name = "section_title", referencedColumnName = "title")
    })
    private Section section;
}
