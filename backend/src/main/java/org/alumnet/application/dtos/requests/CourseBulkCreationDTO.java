package org.alumnet.application.dtos.requests;

import com.opencsv.bean.CsvBindByPosition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseBulkCreationDTO {
    @CsvBindByPosition(position = 0)
    private String name;

    @CsvBindByPosition(position = 1)
    private String description;

    @CsvBindByPosition(position = 2)
    private Double approvalGrade;

    @CsvBindByPosition(position = 3)
    private String shift;

    @CsvBindByPosition(position = 4)
    private String teacherEmails;

    @CsvBindByPosition(position = 5)
    private String startDate;

    @CsvBindByPosition(position = 6)
    private String endDate;
}