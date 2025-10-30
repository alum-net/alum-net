package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.ResourceMetadataDTO;
import org.alumnet.application.dtos.UpdateRequestDTO;
import org.alumnet.application.dtos.requests.SectionRequestDTO;
import org.alumnet.application.mapper.SectionMapper;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.alumnet.domain.repositories.SectionRepository;
import org.alumnet.domain.resources.Resource;
import org.alumnet.domain.resources.SectionResource;
import org.alumnet.infrastructure.exceptions.InvalidAttributeException;
import org.alumnet.infrastructure.exceptions.SectionNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class SectionService {

    private final FileValidationService fileValidationService;
    private final SectionRepository sectionRepository;
    private final CourseService courseService;
    private final S3FileStorageService s3FileStorageService;
    private final SectionMapper sectionMapper;

    public void createSection(SectionRequestDTO sectionDTO, List<MultipartFile> files, Integer courseId) {

        if (sectionDTO.getTitle() == null || sectionDTO.getTitle().isEmpty())
            throw new InvalidAttributeException("El título de la sección no puede estar vacío o no puede ser nulo");

        fileValidationService.validateCreationResourcesMetadataAndFiles(sectionDTO.getResourcesMetadata(), files);

        Course course = courseService.findById(courseId);
        Section section = sectionMapper.toSectionWithCourse(sectionDTO, course);

        if (files != null && !files.isEmpty()) {
            uploadAndLinkFilesToSection(files, section, sectionDTO.getResourcesMetadata());
        }

        sectionRepository.save(section);
    }

    private Map<String, Integer> getFilenameAndOrderFromMetadata(List<ResourceMetadataDTO> resourcesMetadata) {
        return resourcesMetadata.stream()
                .collect(Collectors.toMap(
                        ResourceMetadataDTO::getFilename,
                        ResourceMetadataDTO::getOrder));
    }

    private void uploadAndLinkFilesToSection(List<MultipartFile> files, Section section,
            List<ResourceMetadataDTO> resourcesMetadata) {
        String folderPath = "courses/" + section.getCourseId() + "/sections/" + section.getTitle() + "/resources";

        Map<String, Integer> fileNameToOrder = getFilenameAndOrderFromMetadata(resourcesMetadata);

        files.forEach(file -> {

            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String s3Key = s3FileStorageService.store(file, folderPath);

            Integer order = fileNameToOrder.get(Objects.requireNonNull(originalFilename));
            SectionResource sectionResource = createSectionResource(file, s3Key, fileExtension, order);
            section.addResource(sectionResource);
        });

    }

    private SectionResource createSectionResource(MultipartFile file, String s3Key, String fileExtension,
            Integer order) {
        return SectionResource.builder()
                .name(Objects.requireNonNull(file.getOriginalFilename())
                        .substring(0, file.getOriginalFilename()
                                .lastIndexOf('.')))
                .order(order)
                .url(s3Key)
                .extension(fileExtension)
                .sizeInBytes(file.getSize())
                .build();
    }

    private String getFileExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1))
                .orElse("");
    }

    public void updateSection(Integer courseId, Integer sectionId, UpdateRequestDTO sectionDTO,
            List<MultipartFile> files) {
        Course course = courseService.findById(courseId);
        course.getSections().stream().filter(section -> section.getSectionId().equals(sectionId))
                .findFirst()
                .ifPresent(section -> {
                    List<Integer> resourcesToDelete = sectionDTO.getEliminatedResourcesIds();
                    fileValidationService.validateUpdateResourcesMetadataAndFiles(sectionDTO.getResourcesMetadata(),
                            files, filterSectionResourcesToBeDeleted(section, resourcesToDelete).toList());

                    section.setTitle(sectionDTO.getTitle());
                    section.setDescription(sectionDTO.getDescription());
                    resourcesToEliminate(resourcesToDelete, section);
                    List<ResourceMetadataDTO> metadata = sectionDTO.getResourcesMetadata();
                    if (metadata != null && metadata.size() > 0) {
                        Map<String, Integer> fileNameToOrder = getFilenameAndOrderFromMetadata(metadata);
                        filterSectionResourcesToBeDeleted(section, resourcesToDelete)
                                .forEach(resource -> {
                                    resource.setOrder(fileNameToOrder.get(resource.getOriginalFilename()));
                                });
                    }
                    if (files != null && !files.isEmpty()) {
                        uploadAndLinkFilesToSection(files, section, metadata);
                    }
                    sectionRepository.save(section);
                });

    }

    private Stream<SectionResource> filterSectionResourcesToBeDeleted(Section section,
            List<Integer> resourcesToBeDeleted) {
        return section.getSectionResources().stream()
                .filter(resource -> resourcesToBeDeleted == null
                        || !resourcesToBeDeleted.contains(resource.getId()));
    }

    private void resourcesToEliminate(List<Integer> resourceIds, Section section) {
        if (resourceIds == null || resourceIds.isEmpty())
            return;
        s3FileStorageService.deleteMultipleFiles(section.getSectionResources()
                .stream()
                .filter(sectionResource -> resourceIds.contains(sectionResource.getId()))
                .map(Resource::getUrl).toList());

        section.getSectionResources().removeIf(sectionResource -> resourceIds.contains(sectionResource.getId()));

    }

    public void deleteSection(Integer courseId, Integer sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(SectionNotFoundException::new);

        s3FileStorageService.deleteFolder("courses/" + courseId + "/sections/" + sectionId + "/resources/");
        sectionRepository.delete(section);
    }

    public Section findSectionById(Integer sectionId) {
        return sectionRepository.findById(sectionId).orElseThrow(SectionNotFoundException::new);
    }
}
