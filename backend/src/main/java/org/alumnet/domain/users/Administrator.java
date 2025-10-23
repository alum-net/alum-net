package org.alumnet.domain.users;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.repositories.CourseRepository;
import org.alumnet.domain.repositories.ParticipationRepository;

@Entity
@DiscriminatorValue("admin")
public class Administrator extends User {
    @Override
    public UserRole getRole() {
        return UserRole.ADMIN;
    }

}
