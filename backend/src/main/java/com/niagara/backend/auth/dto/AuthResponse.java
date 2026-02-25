package com.niagara.backend.auth.dto;

public class AuthResponse {
  public Long id;
  public String name;
  public String email;

  public AuthResponse(Long id, String name, String email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
