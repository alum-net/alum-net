package org.alumnet.domain.repositories;

import org.alumnet.domain.resources.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LabelRepository extends JpaRepository<Label, Integer>, JpaSpecificationExecutor<Label> {
}
