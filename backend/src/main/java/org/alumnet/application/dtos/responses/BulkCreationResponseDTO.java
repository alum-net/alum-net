package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class BulkCreationResponseDTO {
    private int totalRecords;
    private int successfulCreations;
    private int failedCreations;
    private List<BulkCreationErrorDetailDTO> errors;
}