package org.alumnet.application.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.alumnet.application.dtos.EventDTO;

import java.util.Set;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDetailDTO extends EventDTO {
    private Set<String> studentsWithPendingSubmission;

}
