package org.alumnet.application.mapper;

import org.alumnet.application.dtos.LabelDTO;
import org.alumnet.domain.resources.Label;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LibraryMapper {
    LabelDTO labelToLabelDTO(Label label);
}
