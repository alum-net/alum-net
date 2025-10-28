package org.alumnet.application.query_builders;

import jakarta.persistence.criteria.Predicate;
import org.alumnet.domain.resources.Label;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class LabelSpecification {
    public static Specification<Label> byName(String name, boolean exact) {
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
