package org.alumnet.application.dtos.requests;

import com.opencsv.bean.CsvBindByPosition;
import lombok.Data;

@Data
public class EnrollmentBulkDTO {
    @CsvBindByPosition(position = 0)
    private String studentEmail;
}
