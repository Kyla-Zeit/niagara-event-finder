package com.niagara.backend.favorites.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public class BulkFavoritesRequest {
  @NotNull
  public List<String> eventIds;
}
