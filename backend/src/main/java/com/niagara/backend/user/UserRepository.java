package com.niagara.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
  boolean existsByEmailIgnoreCase(String email);
  Optional<AppUser> findByEmailIgnoreCase(String email);
}
