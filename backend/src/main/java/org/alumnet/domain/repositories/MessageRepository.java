package org.alumnet.domain.repositories;

import org.alumnet.application.dtos.messaging.ConversationCount;
import org.alumnet.domain.messaging.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    Page<Message> findByConversationIdOrderByTimestampDesc(String conversationId, Pageable pageable);

    long countByConversationIdAndReadFalseAndAuthorNot(String conversationId, String userEmail);

    List<Message> findByConversationIdAndReadFalseAndAuthorNot(String conversationId, String userEmail);

    @Aggregation(pipeline = {
            "{ $match: { conversationId: { $in: ?0 } } }",
            "{ $sort: { timestamp: -1 } }",
            "{ $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' } } }",
            "{ $replaceRoot: { newRoot: '$lastMessage' } }"
    })
    List<Message> findLastMessagesByConversationIds(List<String> conversationIds);

    @Aggregation(pipeline = {
            "{ $match: { conversationId: { $in: ?0 }, read: false, author: { $ne: ?1 } } }",
            "{ $group: { _id: '$conversationId', unreadMessages: { $sum: 1 } } }",
            "{ $project: { conversationId: '$_id', unreadMessages: '$unreadMessages', _id: 0 } }"
    })
    List<ConversationCount> countUnreadByConversationIds(List<String> conversationIds, String userEmail);
}
