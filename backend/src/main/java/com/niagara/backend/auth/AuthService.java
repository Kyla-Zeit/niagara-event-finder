package com.niagara.backend.auth;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.niagara.backend.user.UserRepository;
import com.niagara.backend.auth.dto.AuthResponse;
import com.niagara.backend.auth.dto.SignInRequest;
import com.niagara.backend.auth.dto.SignUpRequest;
import com.niagara.backend.user.AppUser;


@Service
public class AuthService {

  private final UserRepository users;
  private final PasswordEncoder encoder;

public AuthService(UserRepository users, PasswordEncoder encoder) {
  this.users = users;
  this.encoder = encoder;
}


  public AuthResponse signUp(SignUpRequest req) {
    if (users.existsByEmailIgnoreCase(req.email)) {
      throw new AuthException("EMAIL_ALREADY_EXISTS");
    }

    String email = req.email.trim().toLowerCase();
    String name = req.name.trim();
    String hash = encoder.encode(req.password);

    AppUser saved = users.save(new AppUser(name, email, hash));
    return new AuthResponse(saved.getId(), saved.getName(), saved.getEmail());
  }

  public AuthResponse signIn(SignInRequest req) {
    AppUser user = users.findByEmailIgnoreCase(req.email.trim())
        .orElseThrow(() -> new AuthException("INVALID_CREDENTIALS"));

    if (!encoder.matches(req.password, user.getPasswordHash())) {
      throw new AuthException("INVALID_CREDENTIALS");
    }

    return new AuthResponse(user.getId(), user.getName(), user.getEmail());
  }
}
