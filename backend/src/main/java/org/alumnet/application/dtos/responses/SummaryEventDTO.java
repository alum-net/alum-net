package org.alumnet.application.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummaryEventDTO {
    private Integer id;
    private String type;
    private String title;
    private Integer maxGrade;

}
