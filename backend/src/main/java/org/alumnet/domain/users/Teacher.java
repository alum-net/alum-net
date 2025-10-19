package org.alumnet.domain.users;

import jakarta.persistence.*;
import org.alumnet.domain.Course;

import java.util.List;


@Entity
@DiscriminatorValue("teacher")
public class Teacher extends User {
    @ManyToMany(mappedBy = "teachers")
    private List<Course> courses;
}
