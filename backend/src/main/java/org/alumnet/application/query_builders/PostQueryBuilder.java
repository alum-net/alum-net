package org.alumnet.application.query_builders;

import org.alumnet.application.dtos.requests.PostFilterDTO;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.List;

public class PostQueryBuilder {
    public static Query byFilters(PostFilterDTO filter){
        List<Criteria> criteriaList = new ArrayList<>();

        criteriaList.add(Criteria.where("forumName").is(filter.getForumType().getValue()));
        criteriaList.add(Criteria.where("courseId").is(filter.getCourseId()));
        criteriaList.add(Criteria.where("enabled").is(true));

        if (filter.getRootPost() != null && !filter.getRootPost().isBlank()) {
            criteriaList.add(Criteria.where("rootPost").is(filter.getRootPost()));

        } else {
            criteriaList.add(Criteria.where("parentPost").is(null));
        }

        Criteria finalCriteria = new Criteria();
        finalCriteria.andOperator(criteriaList.toArray(new Criteria[0]));

        return Query.query(finalCriteria);
    }
}
