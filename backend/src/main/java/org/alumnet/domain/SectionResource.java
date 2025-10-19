package org.alumnet.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "section_resource")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SectionResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "section_course_id", referencedColumnName = "course_id"),
            @JoinColumn(name = "section_title", referencedColumnName = "title")
    })
    private Section section;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;
}
