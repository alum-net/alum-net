package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class BulkTaskResponseDTO {
    private int totalRecords;
    private int successfulRecords;
    private int failedRecords;
    private List<BulkTaskErrorDetailDTO> errors;
}