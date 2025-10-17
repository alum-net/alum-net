package org.alumnet.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@DiscriminatorValue("teacher")
public class Teacher extends User {
    @ManyToMany(mappedBy = "teachers")
    private List<Course> courses;
}
