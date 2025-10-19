package org.alumnet.application.mapper;

import org.alumnet.application.dtos.SectionCreationRequestDTO;
import org.alumnet.domain.Section;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SectionMapper {

    @Mapping(source = "title", target = "id.title")
    Section sectionCreationRequestDTOToSection(SectionCreationRequestDTO section);


}
