package com.niagara.backend.user;

import jakarta.persistence.*;

@Entity
public class AppUser {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @Column(unique = true)
  private String email;

  private String passwordHash;

  protected AppUser() {}

  public AppUser(String name, String email, String passwordHash) {
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  public Long getId() { return id; }
  public String getName() { return name; }
  public String getEmail() { return email; }
  public String getPasswordHash() { return passwordHash; }
}
