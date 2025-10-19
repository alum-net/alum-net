package org.alumnet.domain;

import jakarta.persistence.*;
import lombok.*;
import org.alumnet.application.enums.ResourceType;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String url;
    private String extension;
    private int size_in_bytes;
    @Enumerated(EnumType.STRING)
    private ResourceType type;
}
