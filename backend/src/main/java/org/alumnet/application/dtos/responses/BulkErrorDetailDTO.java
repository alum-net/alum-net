package org.alumnet.application.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
<<<<<<<< HEAD:backend/src/main/java/org/alumnet/application/dtos/responses/BulkErrorDetailDTO.java
public class BulkErrorDetailDTO {
========
public class BulkTaskErrorDetailDTO {
>>>>>>>> origin:backend/src/main/java/org/alumnet/application/dtos/responses/BulkTaskErrorDetailDTO.java
    private int lineNumber;
    private String identifier;
    private String reason;
}