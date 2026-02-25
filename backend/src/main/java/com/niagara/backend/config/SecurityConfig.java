package com.niagara.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors(cors -> cors.configurationSource(req -> {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(
          "http://localhost:5173",
          "http://localhost:8080"
        ));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(false);
        return cfg;
      }))
      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/h2-console/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
        .requestMatchers("/api/favorites/**").permitAll()
        .anyRequest().denyAll()
      )
      .headers(h -> h.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
      .httpBasic(Customizer.withDefaults());

    return http.build();
  }
}
