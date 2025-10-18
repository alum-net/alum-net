package org.alumnet.domain.repositories;

import org.alumnet.application.enums.UserRole;
import org.alumnet.domain.Student;
import org.alumnet.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    @Query("SELECT s FROM Student s WHERE s.email = :email")
    Optional<Student> findStudentByEmail(@Param("email") String email);

}
