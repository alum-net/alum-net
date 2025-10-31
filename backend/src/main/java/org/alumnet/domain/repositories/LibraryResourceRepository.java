package org.alumnet.domain.repositories;

import org.alumnet.domain.resources.LibraryResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryResourceRepository extends JpaRepository<LibraryResource, Integer>, JpaSpecificationExecutor<LibraryResource> {
    @EntityGraph(attributePaths = {"labels", "creator"})
    Page<LibraryResource> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"labels", "creator"})
    Page<LibraryResource> findAll(Specification<LibraryResource> spec, Pageable pageable);
}
