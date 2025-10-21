package org.alumnet.domain;

import jakarta.persistence.*;
import lombok.*;
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
    @EmbeddedId
    private SectionId id;
    @Column(length = 500)
    private String description;
    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Course course;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SectionResource> sectionResources = new ArrayList<>();


    public void addResource(SectionResource resource) {
        sectionResources.add(resource);
        resource.setSection(this);
    }

}
