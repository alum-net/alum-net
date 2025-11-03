package org.alumnet.application.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.alumnet.application.dtos.CourseContentDTO;
import org.alumnet.application.dtos.LabelDTO;
import org.alumnet.application.dtos.LibraryResourceDTO;
import org.alumnet.application.dtos.requests.LibraryResourceCreationRequestDTO;
import org.alumnet.application.dtos.requests.LibraryResourceFilterDTO;
import org.alumnet.application.mapper.LibraryMapper;
import org.alumnet.application.query_builders.LabelSpecification;
import org.alumnet.application.query_builders.LibraryResourceSpecification;
import org.alumnet.domain.repositories.LabelRepository;
import org.alumnet.domain.repositories.LibraryResourceRepository;
import org.alumnet.domain.repositories.UserRepository;
import org.alumnet.domain.resources.Label;
import org.alumnet.domain.resources.LibraryResource;
import org.alumnet.domain.users.User;
import org.alumnet.infrastructure.exceptions.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class LibraryService {
    private final LabelRepository labelRepository;
    private final LibraryResourceRepository libraryResourceRepository;
    private final UserRepository userRepository;
    private final S3FileStorageService fileStorageService;
    private final FileValidationService fileValidationService;
    private final LibraryMapper libraryMapper;
    private final S3FileStorageService s3FileStorageService;
    @Value("${aws.s3.duration-url-hours}")
    private long urlDuration;

    public Page<LabelDTO> getLabel(String textToSearch, Pageable page) {
        Page<Label> labelPage;

        if (textToSearch == null) {
            labelPage = labelRepository.findAll(page);
        } else {
            Specification<Label> labelSpec = LabelSpecification.byName(textToSearch, false);
            labelPage = labelRepository.findAll(labelSpec, page);
        }

        return labelPage.map(libraryMapper::labelToLabelDTO);
    }

    public LabelDTO createLabel(String label) {
        Specification<Label> labelSpec = LabelSpecification.byName(label, true);

        if (labelRepository.exists(labelSpec))
            throw new LabelAlreadyExistsException();

        Label newLabel = Label.builder().name(label).build();

        labelRepository.save(newLabel);

        return libraryMapper.labelToLabelDTO(newLabel);
    }

    @Transactional
    public void deleteLabel(int labelId) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(LabelNotFoundException::new);

        for (LibraryResource resource : label.getResources()) {
            resource.getLabels().remove(label);
        }

        label.getResources().clear();

        labelRepository.delete(label);
    }

    public Page<LibraryResourceDTO> getResources(LibraryResourceFilterDTO filter, Pageable page) {
        boolean hasFilter = filter != null
                && (filter.getName() != null
                        || (filter.getLabelIds() != null && !filter.getLabelIds().isEmpty()));

        Page<LibraryResource> resources;

        if (!hasFilter) {
            resources = libraryResourceRepository.findAll(page);
        } else {
            Specification<LibraryResource> resourceSpec = LibraryResourceSpecification.byFilters(filter);
            resources = libraryResourceRepository.findAll(resourceSpec, page);
        }

        return resources.map(resource -> {
            LibraryResourceDTO dto = libraryMapper.libraryToLibraryResourceDTO(resource);
            dto.setUrl(s3FileStorageService
                    .generatePresignedUrl(dto.getUrl(), Duration.ofHours(urlDuration)));
            return dto;
        });
    }

    public void createResource(MultipartFile file, LibraryResourceCreationRequestDTO metadata) {
        String fileName = file.getOriginalFilename();

        fileValidationService.validateFile(file, false);

        Specification<LibraryResource> resourceSpec = LibraryResourceSpecification.byName(fileName, true);
        if (libraryResourceRepository.exists(resourceSpec))
            throw new LibraryResourceAlreadyExistsException();

        String url = fileStorageService.store(file, "library/resources");

        User creator = userRepository.findById(metadata.getCreatorEmail()).orElseThrow(UserNotFoundException::new);

        Set<Label> labels = new HashSet<>(labelRepository
                .findAllById(metadata.getLabelIds()));

        LibraryResource libraryResource = LibraryResource.builder()
                .createdAt(new Date())
                .creator(creator)
                .url(url)
                .name(fileName)
                .extension(fileValidationService.getFileExtension(fileName))
                .title(metadata.getTitle())
                .sizeInBytes(file.getSize())
                .labels(labels)
                .build();

        libraryResourceRepository.save(libraryResource);
    }

    public void deleteResource(Integer resourceId) {
        LibraryResource libraryResource = libraryResourceRepository
                .findById(resourceId)
                .orElseThrow(LibraryResourceNotFoundException::new);

        fileStorageService.deleteMultipleFile(libraryResource.getUrl());

        libraryResourceRepository.delete(libraryResource);
    }

    public void modifyLabel(int labelId, String name) {
        Label label = labelRepository.findById(labelId).orElseThrow(LabelNotFoundException::new);
        if(!Objects.equals(name, label.getName())){
            label.setName(name);
            labelRepository.save(label);
        }
    }
}
