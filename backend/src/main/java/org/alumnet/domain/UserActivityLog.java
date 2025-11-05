package org.alumnet.domain;

import jakarta.persistence.*;
import lombok.*;
import org.alumnet.domain.users.User;
import org.alumnet.application.enums.ActivityType;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity_log")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "resource_id")
    private String resourceId;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
}