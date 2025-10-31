package org.alumnet.application.query_builders;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.List;

public class NotificationQueryBuilder {
    public static Query byEventId(int eventId){
        List<Criteria> criteriaList = new ArrayList<>();

        criteriaList.add(Criteria.where("eventId").is(eventId));

        Criteria finalCriteria = new Criteria();
        finalCriteria.andOperator(criteriaList.toArray(new Criteria[0]));

        return Query.query(finalCriteria);
    }
}
