package org.alumnet.domain.events;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "questionnaire_response")
public class QuestionnaireResponseDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "event_id",
                    referencedColumnName = "event_id",
                    nullable = false),
            @JoinColumn(name = "student_email",
                    referencedColumnName = "student_email",
                    nullable = false)
    })
    private EventParticipation attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id")
    private Answer studentAnswer;

    private LocalDateTime attemptDate;
}
