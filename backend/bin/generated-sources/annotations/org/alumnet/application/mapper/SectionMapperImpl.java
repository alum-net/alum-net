package org.alumnet.application.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.alumnet.application.dtos.SectionDTO;
import org.alumnet.application.dtos.requests.SectionRequestDTO;
import org.alumnet.application.dtos.responses.SectionResourceResponseDTO;
import org.alumnet.domain.Course;
import org.alumnet.domain.Section;
import org.alumnet.domain.resources.SectionResource;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-27T16:22:45-0300",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class SectionMapperImpl implements SectionMapper {

    @Override
    public Section toSectionWithCourse(SectionRequestDTO dto, Course course) {
        if ( dto == null && course == null ) {
            return null;
        }

        Section.SectionBuilder section = Section.builder();

        if ( dto != null ) {
            section.title( dto.getTitle() );
            section.description( dto.getDescription() );
        }
        if ( course != null ) {
            section.courseId( course.getId() );
            section.course( course );
        }

        return section.build();
    }

    @Override
    public SectionDTO sectionToSectionDTO(Section section) {
        if ( section == null ) {
            return null;
        }

        SectionDTO.SectionDTOBuilder sectionDTO = SectionDTO.builder();

        sectionDTO.id( section.getSectionId() );
        sectionDTO.description( section.getDescription() );
        sectionDTO.sectionResources( sectionResourceListToSectionResourceResponseDTOList( section.getSectionResources() ) );
        sectionDTO.title( section.getTitle() );

        return sectionDTO.build();
    }

    protected SectionResourceResponseDTO sectionResourceToSectionResourceResponseDTO(SectionResource sectionResource) {
        if ( sectionResource == null ) {
            return null;
        }

        SectionResourceResponseDTO sectionResourceResponseDTO = new SectionResourceResponseDTO();

        sectionResourceResponseDTO.setExtension( sectionResource.getExtension() );
        sectionResourceResponseDTO.setId( sectionResource.getId() );
        sectionResourceResponseDTO.setName( sectionResource.getName() );
        sectionResourceResponseDTO.setOrder( sectionResource.getOrder() );
        sectionResourceResponseDTO.setUrl( sectionResource.getUrl() );

        return sectionResourceResponseDTO;
    }

    protected List<SectionResourceResponseDTO> sectionResourceListToSectionResourceResponseDTOList(List<SectionResource> list) {
        if ( list == null ) {
            return null;
        }

        List<SectionResourceResponseDTO> list1 = new ArrayList<SectionResourceResponseDTO>( list.size() );
        for ( SectionResource sectionResource : list ) {
            list1.add( sectionResourceToSectionResourceResponseDTO( sectionResource ) );
        }

        return list1;
    }
}
