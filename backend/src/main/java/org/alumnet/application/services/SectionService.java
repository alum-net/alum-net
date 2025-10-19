package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.SectionCreationRequestDTO;
import org.alumnet.application.enums.ResourceType;
import org.alumnet.application.mapper.SectionMapper;
import org.alumnet.domain.Course;
import org.alumnet.domain.Resource;
import org.alumnet.domain.Section;
import org.alumnet.domain.SectionResource;
import org.alumnet.domain.repositories.ResourceRepository;
import org.alumnet.domain.repositories.SectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SectionService {


    private final FileValidationService fileValidationService;
    private final SectionRepository sectionRepository;
    private final CourseService courseService;
    private final S3FileStorageService s3FileStorageService;
    private final SectionMapper sectionMapper;
    private final ResourceRepository resourceRepository;

    public void createSection(SectionCreationRequestDTO sectionDTO, List<MultipartFile> files, int courseId) {
        if (files != null && !files.isEmpty())
            fileValidationService.validateFiles(files);

        Course course = courseService.findById(courseId);
        Section section = sectionMapper.toSectionWithCourse(sectionDTO,course);

        if (files != null && !files.isEmpty()) {
            uploadAndLinkFilesToSection(files, section);
        }

        course.getSections().add(section);
        courseService.updateCourse(course);
    }

    private void uploadAndLinkFilesToSection(List<MultipartFile> files, Section section) {
        List<SectionResource> sectionResources = new ArrayList<>();

        files.forEach(file -> {

            String fileExtension = getFileExtension(file.getOriginalFilename());
            String s3Key = s3FileStorageService.store(file, fileExtension);

            Resource resource = createResource(file, s3Key, fileExtension);

            resource = resourceRepository.save(resource);
            SectionResource sectionResource = createSectionResource(section, file, resource);

            sectionResources.add(sectionResource);
        });
        section.setSectionResources(sectionResources);
    }

    private static SectionResource createSectionResource(Section section, MultipartFile file, Resource resource) {
        return SectionResource.builder()
                .title(file.getOriginalFilename())
                .section(section)
                .resource(resource)
                .build();
    }

    private static Resource createResource(MultipartFile file, String s3Key, String fileExtension) {
        return Resource.builder()
                .name(file.getOriginalFilename())
                .url(s3Key)
                .extension(fileExtension)
                .type(ResourceType.COURSE)
                .sizeInBytes(file.getSize())
                .build();
    }

    private String getFileExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1))
                .orElse("");
    }


}
