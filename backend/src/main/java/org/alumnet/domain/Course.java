package org.alumnet.domain;

import jakarta.persistence.*;
import lombok.*;
import org.alumnet.application.enums.ShiftType;
import org.alumnet.domain.users.Teacher;

import java.util.Date;
import java.util.List;

@Entity
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ShiftType shift;

    private String description;

    private double approvalGrade;

    private Date startDate;

    private Date endDate;

    private boolean enabled;

    @ManyToMany
    @JoinTable(
        name = "teacher_course",
        joinColumns = @JoinColumn(
                name = "course_id",
                referencedColumnName = "id"
        ),
        inverseJoinColumns = @JoinColumn(
                name = "teacher_email",
                referencedColumnName = "email"
        )
    )
    private List<Teacher> teachers;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<CourseParticipation> participations;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Section> sections;

}
