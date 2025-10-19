package org.alumnet.domain;

import jakarta.persistence.*;
import lombok.*;
import org.alumnet.application.enums.ResourceType;

import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String url;
    private String extension;

    @Enumerated(EnumType.STRING)
    private ResourceType type;

    private Long sizeInBytes;

    @ManyToMany
    @JoinTable(
            name = "resource_label",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private Set<Label> labels;
}