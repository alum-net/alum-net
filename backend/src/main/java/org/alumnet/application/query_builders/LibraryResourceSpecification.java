package org.alumnet.application.query_builders;

import jakarta.persistence.criteria.*;
import org.alumnet.application.dtos.requests.LibraryResourceFilterDTO;
import org.alumnet.domain.resources.Label;
import org.alumnet.domain.resources.LibraryResource;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class LibraryResourceSpecification {
    public static Specification<LibraryResource> byFilters(LibraryResourceFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getName() != null && !filter.getName().trim().isEmpty()) {

                String searchPattern = "%" + filter.getName().trim().toLowerCase() + "%";

                Predicate titleMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        searchPattern
                );

                Predicate nameMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        searchPattern
                );

                predicates.add(criteriaBuilder.or(titleMatch, nameMatch));
            }

            if (filter.getLabelIds() != null && !filter.getLabelIds().isEmpty()) {
                query.distinct(true);
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<LibraryResource> subRoot = subquery.from(LibraryResource.class);

                Join<LibraryResource, Label> labelsJoin = subRoot.join("labels", JoinType.INNER);

                subquery.select(criteriaBuilder.count(labelsJoin))
                        .where(
                                criteriaBuilder.equal(subRoot.get("id"), root.get("id")),
                                labelsJoin.get("id").in(filter.getLabelIds())
                        )
                        .groupBy(subRoot.get("id"));

                predicates.add(
                        criteriaBuilder.equal(
                                subquery.getSelection(),
                                (long) filter.getLabelIds().size()
                        )
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<LibraryResource> byName(String name, boolean exact){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null) {
                if(!exact){
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("name")),
                            "%" + name.toLowerCase() + "%"
                    ));
                }
                else{
                    predicates.add(criteriaBuilder.equal(
                            criteriaBuilder.lower(root.get("name")),
                            name.toLowerCase()
                    ));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
