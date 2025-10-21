package org.alumnet.domain.repositories;

import org.alumnet.domain.resources.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {
}
