package org.alumnet.application.dtos.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkReadRequest {
    private String messageId;
    private Instant upToTimestamp;
}
