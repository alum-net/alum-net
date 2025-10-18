package org.alumnet.domain;

import jakarta.persistence.*;

@Entity
public class CourseParticipation {

    @EmbeddedId
    private CourseParticipationId id;

    @ManyToOne
    @JoinColumn(name = "student_email", referencedColumnName = "email")
    @MapsId("studentEmail")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    @MapsId("courseId")
    private Course course;

    @Column(name = "grade")
    private Double grade;
}
