package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BulkCreationErrorDetailDTO {
    private int lineNumber;
    private String identifier;
    private String reason;
}