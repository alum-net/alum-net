package org.alumnet.domain;

import jakarta.persistence.*;
import org.alumnet.application.enums.ShiftType;

import java.util.Date;
import java.util.List;

@Entity
public class Course {
    @Id
    private int id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ShiftType shiftType;

    private String description;

    private double approvalGrade;

    private Date startDate;

    private Date endDate;

    private boolean enabled;

    @ManyToMany
    @JoinTable(name = "TeacherCourse",
        joinColumns = @JoinColumn(name = "id"),
        inverseJoinColumns = @JoinColumn(name = "email"))
    private List<Teacher> teachers;

    @OneToMany(mappedBy = "id", cascade = CascadeType.ALL)
    private List<CourseParticipation> participations;
}
