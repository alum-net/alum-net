package org.alumnet.domain.resources;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.alumnet.domain.users.User;

import java.util.Date;
import java.util.Set;

@Entity
@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("library")
public class LibraryResource extends Resource {
    private String title;
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "creator_email")
    private User creator;

    @ManyToMany
    @JoinTable(
            name = "resource_label",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private Set<Label> labels;
}
