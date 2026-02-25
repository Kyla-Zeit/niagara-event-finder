package com.niagara.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignUpRequest {
  @NotBlank @Size(min = 2, max = 120)
  public String name;

  @NotBlank @Email @Size(max = 190)
  public String email;

  @NotBlank @Size(min = 6, max = 72)
  public String password;
}
