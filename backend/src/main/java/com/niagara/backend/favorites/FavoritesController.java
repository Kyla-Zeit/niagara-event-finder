package com.niagara.backend.favorites;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.niagara.backend.favorites.dto.BulkFavoritesRequest;
import com.niagara.backend.user.AppUser;
import com.niagara.backend.user.UserRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
public class FavoritesController {

  private final UserRepository users;
  private final UserFavoriteRepository favorites;

  public FavoritesController(UserRepository users, UserFavoriteRepository favorites) {
    this.users = users;
    this.favorites = favorites;
  }

  @GetMapping("/{userId}")
  public List<String> list(@PathVariable Long userId) {
    // Ensure user exists (nice, predictable 404)
    users.findById(userId).orElseThrow(() -> new FavoritesException("USER_NOT_FOUND"));
    return favorites.findAllByUser_Id(userId).stream().map(UserFavorite::getEventId).toList();
  }

  @PostMapping("/{userId}/{eventId}")
  public FavoriteStatus add(@PathVariable Long userId, @PathVariable String eventId) {
    AppUser user = users.findById(userId).orElseThrow(() -> new FavoritesException("USER_NOT_FOUND"));
    String id = eventId.trim();
    if (!favorites.existsByUser_IdAndEventId(userId, id)) {
      favorites.save(new UserFavorite(user, id));
    }
    return new FavoriteStatus(id, true);
  }

  @DeleteMapping("/{userId}/{eventId}")
  public FavoriteStatus remove(@PathVariable Long userId, @PathVariable String eventId) {
    users.findById(userId).orElseThrow(() -> new FavoritesException("USER_NOT_FOUND"));
    String id = eventId.trim();
    favorites.deleteByUser_IdAndEventId(userId, id);
    return new FavoriteStatus(id, false);
  }

  // Convenience: migrate local favorites after login
  @PostMapping("/{userId}/bulk")
  public List<String> bulkAdd(@PathVariable Long userId, @Valid @RequestBody BulkFavoritesRequest req) {
    AppUser user = users.findById(userId).orElseThrow(() -> new FavoritesException("USER_NOT_FOUND"));

    Set<String> unique = new LinkedHashSet<>();
    if (req.eventIds != null) {
      for (String id : req.eventIds) {
        if (id == null) continue;
        String trimmed = id.trim();
        if (!trimmed.isEmpty()) unique.add(trimmed);
      }
    }

    for (String id : unique) {
      if (!favorites.existsByUser_IdAndEventId(userId, id)) {
        favorites.save(new UserFavorite(user, id));
      }
    }

    return favorites.findAllByUser_Id(userId).stream().map(UserFavorite::getEventId).toList();
  }

  @ExceptionHandler(FavoritesException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ErrorResponse handle(FavoritesException ex) {
    return new ErrorResponse(ex.getMessage());
  }

  public record FavoriteStatus(String eventId, boolean saved) {}

  public record ErrorResponse(String error) {}
}
