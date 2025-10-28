package org.alumnet.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.alumnet.application.dtos.requests.SectionRequestDTO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UpdateRequestDTO extends SectionRequestDTO {
    List<Integer> eliminatedResourcesIds;
}
