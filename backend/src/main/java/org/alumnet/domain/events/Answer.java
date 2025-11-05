package org.alumnet.domain.events;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "answers")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String text;

    @Column(name = "is_correct")
    private Boolean correct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @OneToMany(mappedBy = "studentAnswer", fetch = FetchType.LAZY)
    private Set<QuestionnaireResponseDetail> responses;
}
