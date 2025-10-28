package org.alumnet.application.mapper;

import org.alumnet.application.dtos.LabelDTO;
import org.alumnet.application.dtos.LibraryResourceDTO;
import org.alumnet.domain.resources.Label;
import org.alumnet.domain.resources.LibraryResource;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface LibraryMapper {
    LabelDTO labelToLabelDTO(Label label);

    List<LabelDTO> mapLabels(Set<Label> labels);

    @Mapping(source = "creator", target = "creator")
    @Mapping(source = "labels", target = "labels")
    LibraryResourceDTO libraryToLibraryResourceDTO(LibraryResource libraryResource);
}
