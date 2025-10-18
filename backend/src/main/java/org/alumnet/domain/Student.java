package org.alumnet.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
@DiscriminatorValue("student")
public class Student extends User{
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<CourseParticipation> participations;
}
