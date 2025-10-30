package org.alumnet.application.dtos.requests;

import com.opencsv.bean.CsvBindByPosition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserBulkCreationDTO {
    @CsvBindByPosition(position = 0)
    private String email;
    @CsvBindByPosition(position = 1)
    private String group;
    @CsvBindByPosition(position = 2)
    private String name;
    @CsvBindByPosition(position = 3)
    private String lastname;
}