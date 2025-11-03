package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BulkTaskErrorDetailDTO {
    private int lineNumber;
    private String identifier;
    private String reason;
}