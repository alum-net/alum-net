package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.SectionCreationRequestDTO;
import org.alumnet.application.mapper.SectionMapper;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.alumnet.domain.repositories.SectionRepository;
import org.alumnet.domain.resources.SectionResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public void createSection(SectionCreationRequestDTO sectionDTO, List<MultipartFile> files, int courseId) {
        if (files != null && !files.isEmpty())
            fileValidationService.validateFiles(files);

        Course course = courseService.findById(courseId);
        Section section = sectionMapper.toSectionWithCourse(sectionDTO,course);

        if (files != null && !files.isEmpty()) {
            uploadAndLinkFilesToSection(files, section);
        }

        sectionRepository.save(section);
    }

    private void uploadAndLinkFilesToSection(List<MultipartFile> files, Section section) {
        String folderPath = "courses/" + section.getCourse().getId() + "/sections/" + section.getId().getTitle() + "/resources/";

        files.forEach(file -> {

            String fileExtension = getFileExtension(file.getOriginalFilename());
            String s3Key = s3FileStorageService.store(file, fileExtension,folderPath);

            SectionResource sectionResource = createSectionResource(file, s3Key, fileExtension);
            section.addResource(sectionResource);
        });

    }


    private SectionResource createSectionResource(MultipartFile file, String s3Key, String fileExtension) {
        return SectionResource.builder()
                .name(file.getOriginalFilename())
                .url(s3Key)
                .extension(fileExtension)
                .sizeInBytes(file.getSize())
                .title(file.getOriginalFilename())
                .build();
    }

    private String getFileExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1))
                .orElse("");
    }


}
