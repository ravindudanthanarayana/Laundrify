package com.example.laundry.repository;

import com.example.laundry.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);

    // keep case-sensitive variants too if some code still calls these
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
