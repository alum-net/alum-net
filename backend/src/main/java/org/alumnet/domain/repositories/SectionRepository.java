package org.alumnet.domain.repositories;

import org.alumnet.domain.Section;
import org.alumnet.domain.SectionId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionRepository extends JpaRepository<Section, SectionId> {

    Page<Section> findAllByCourseId(Integer courseId, Pageable pageable);
}
