package com.preplan.autoplan.restController.keyword;

import com.preplan.autoplan.service.keyword.KeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/private/keywords")
@RequiredArgsConstructor
public class KeywordController {

  private final KeywordService keywordService;

  @GetMapping("/search")
  public ResponseEntity<List<String>> searchKeywords(@RequestParam String prefix) {
    if (prefix == null || prefix.trim().isEmpty()) {
      return ResponseEntity.ok(List.of());
    }
    List<String> keywordNames = keywordService.searchKeywordsByPrefix(prefix).stream()
        .map(keyword -> keyword.getName())
        .collect(Collectors.toList());
    return ResponseEntity.ok(keywordNames);
  }
}
