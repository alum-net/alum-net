package org.alumnet.domain;


import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @EmbeddedId
    private UserKey key;
    private String name;
    @Column(name = "last_name")
    private String lastname;
    @Column(name = "avatar_url")
    private String avatarUrl;
    private boolean enabled;

}
