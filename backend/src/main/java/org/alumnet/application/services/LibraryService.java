package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.LabelDTO;
import org.alumnet.application.mapper.LibraryMapper;
import org.alumnet.application.query_builders.LabelSpecification;
import org.alumnet.domain.repositories.LabelRepository;
import org.alumnet.domain.resources.Label;
import org.alumnet.infrastructure.exceptions.LabelAlreadyExistsException;
import org.alumnet.infrastructure.exceptions.LabelNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LibraryService {
    private final LabelRepository labelRepository;
    private final LibraryMapper libraryMapper;

    public Page<LabelDTO> getLabel(String textToSearch, Pageable page) {
        Page<Label> labelPage;

        if(textToSearch == null){
            labelPage = labelRepository.findAll(page);
        }else{
            Specification<Label> labelSpec = LabelSpecification.byName(textToSearch, false);
            labelPage = labelRepository.findAll(labelSpec, page);
        }

        return labelPage.map(libraryMapper::labelToLabelDTO);
    }

    public LabelDTO createLabel(String label) {
        Specification<Label> labelSpec = LabelSpecification.byName(label, true);

        if(labelRepository.exists(labelSpec)) throw new LabelAlreadyExistsException();

        Label newLabel = Label.builder().name(label).build();

        labelRepository.save(newLabel);

        return libraryMapper.labelToLabelDTO(newLabel);
    }

    public void deleteLabel(int labelId) {
        Label label = labelRepository.findById(labelId).orElseThrow(LabelNotFoundException::new);

        labelRepository.delete(label);
    }
}
