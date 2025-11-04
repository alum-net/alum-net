package org.alumnet.domain.users;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.events.EventParticipation;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@DiscriminatorValue("student")
public class Student extends User{
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private Set<CourseParticipation> participations;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private Set<EventParticipation> eventParticipations;

    @Override
    public UserRole getRole() {
        return UserRole.STUDENT;
    }
}
