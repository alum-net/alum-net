package org.alumnet.domain.users;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.CourseParticipation;
import org.alumnet.domain.events.EventParticipation;

import java.util.List;

@Entity
@DiscriminatorValue("student")
public class Student extends User{
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<CourseParticipation> participations;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    List<EventParticipation> eventParticipations;

    @Override
    public UserRole getRole() {
        return UserRole.STUDENT;
    }
}
