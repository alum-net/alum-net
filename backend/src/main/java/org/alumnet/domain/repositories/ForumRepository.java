package org.alumnet.domain.repositories;

import org.alumnet.domain.forums.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumRepository extends MongoRepository<Post, String> {
}
