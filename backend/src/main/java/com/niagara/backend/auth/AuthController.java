package com.niagara.backend.auth;

import com.niagara.backend.auth.dto.AuthResponse;
import com.niagara.backend.auth.dto.SignInRequest;
import com.niagara.backend.auth.dto.SignUpRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService auth;

  public AuthController(AuthService auth) {
    this.auth = auth;
  }

  @PostMapping("/signup")
  public AuthResponse signup(@Valid @RequestBody SignUpRequest req) {
    return auth.signUp(req);
  }

  @PostMapping("/signin")
  public AuthResponse signin(@Valid @RequestBody SignInRequest req) {
    return auth.signIn(req);
  }

  @ExceptionHandler(AuthException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handle(AuthException ex) {
    return Map.of("error", ex.getMessage());
  }
}
