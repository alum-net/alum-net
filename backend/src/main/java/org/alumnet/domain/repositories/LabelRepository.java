package org.alumnet.domain.repositories;

import org.alumnet.domain.resources.Label;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LabelRepository extends JpaRepository<Label, Integer>, JpaSpecificationExecutor<Label> {
    @EntityGraph(attributePaths = {"resources"})
    Optional<Label> findById(Integer id);
}
