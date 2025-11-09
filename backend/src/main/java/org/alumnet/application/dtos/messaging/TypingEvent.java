package org.alumnet.application.dtos.messaging;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypingEvent {
    @JsonProperty("isTyping")
    private boolean isTyping;
    private String userEmail;
}

