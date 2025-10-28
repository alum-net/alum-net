package org.alumnet.domain.users;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.resources.LibraryResource;

import java.util.Set;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class User {
    @Id
    private String email;
    private String name;
    @Column(name = "last_name")
    private String lastname;
    @Column(name = "avatar_url")
    private String avatarUrl;
    private boolean enabled;

    @OneToMany(mappedBy = "creator", fetch = FetchType.LAZY)
    private Set<LibraryResource> libraryResources;

    public abstract UserRole getRole();

}
