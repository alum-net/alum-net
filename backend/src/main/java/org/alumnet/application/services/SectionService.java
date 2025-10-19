package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import org.alumnet.application.dtos.SectionCreationRequestDTO;
import org.alumnet.application.mapper.SectionMapper;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.alumnet.domain.repositories.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
        Section section = sectionMapper.sectionCreationRequestDTOToSection(sectionDTO);
        course.getSections().add(section);

        if (files != null)
            files.forEach(s3FileStorageService::store);


        courseService.updateCourse(course);
        sectionRepository.save(section);

    }
}
