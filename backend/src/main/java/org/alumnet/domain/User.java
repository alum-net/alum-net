package org.alumnet.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
public class User {
    @Id
    private String email;
    private String name;
    @Column(name = "last_name")
    private String lastname;
    @Column(name = "avatar_url")
    private String avatarUrl;
    private boolean enabled;
    private String role;
}
