package com.niagara.backend.favorites;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
  List<UserFavorite> findAllByUser_Id(Long userId);

  boolean existsByUser_IdAndEventId(Long userId, String eventId);

  long deleteByUser_IdAndEventId(Long userId, String eventId);
}
