package org.alumnet.application.dtos.requests;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionsDTO {
    private String studentName;
    private String studentLastname;
    private String studentEmail;
    private String fileName;
    private String fileUrl;
}
