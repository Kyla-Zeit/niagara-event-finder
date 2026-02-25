package com.niagara.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignInRequest {
  @NotBlank @Email @Size(max = 190)
  public String email;

  @NotBlank @Size(min = 6, max = 72)
  public String password;
}
