package org.alumnet.domain;

import jakarta.persistence.*;
import lombok.*;
import org.alumnet.domain.events.Event;
import org.alumnet.domain.resources.SectionResource;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Integer sectionId;
    private String title;
    @Column(name = "course_id")
    private Integer courseId;
    @Column(length = 500)
    private String description;
    @ManyToOne
    @JoinColumn(name = "course_id", insertable = false, updatable = false)
    private Course course;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SectionResource> sectionResources = new ArrayList<>();

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Event> events = new ArrayList<>();

    public void addResource(SectionResource resource) {
        sectionResources.add(resource);
        resource.setSection(this);
    }

}
