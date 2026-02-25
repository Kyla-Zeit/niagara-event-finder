package com.niagara.backend.favorites;

import java.time.Instant;

import com.niagara.backend.user.AppUser;
import jakarta.persistence.*;

@Entity
@Table(
    name = "user_favorites",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_favorites_user_event", columnNames = {"user_id", "event_id"})
    }
)
public class UserFavorite {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private AppUser user;

  @Column(name = "event_id", nullable = false, length = 64)
  private String eventId;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  protected UserFavorite() {}

  public UserFavorite(AppUser user, String eventId) {
    this.user = user;
    this.eventId = eventId;
  }

  public Long getId() {
    return id;
  }

  public AppUser getUser() {
    return user;
  }

  public String getEventId() {
    return eventId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
