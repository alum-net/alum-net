package org.alumnet.domain.repositories;

import org.alumnet.domain.messaging.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    @Query("{ 'participants': { $in: [?0] } }")
    List<Conversation> findByParticipantEmail(String userEmail);

    @Query("{ 'participants': ?0 }")
    Optional<Conversation> findByParticipants(List<String> participants);
}
