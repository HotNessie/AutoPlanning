package com.preplan.autoplan.restController;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiKeyController {
  // map api 키
  @Value("${google.api.client-key}")
  private String googleApiKey;

  @GetMapping("/api/google-maps-key")
  public ResponseEntity<String> getGoogleMapsApiKey() {
    return ResponseEntity.ok(googleApiKey);
  }
}