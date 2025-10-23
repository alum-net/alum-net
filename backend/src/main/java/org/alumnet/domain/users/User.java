package org.alumnet.domain.users;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.enums.UserRole;

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

    public abstract UserRole getRole();

}
