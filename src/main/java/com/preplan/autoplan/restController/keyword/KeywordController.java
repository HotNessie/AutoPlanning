package com.preplan.autoplan.restController.keyword;

import com.preplan.autoplan.service.keyword.KeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class KeywordController {

  private final KeywordService keywordService;

  @GetMapping("/public/keywords/search")
  public ResponseEntity<List<String>> searchKeywords(@RequestParam String prefix) {
    if (prefix == null || prefix.trim().isEmpty()) {
      return ResponseEntity.ok(List.of());
    }
    Pageable pageable = PageRequest.of(0, 10, Sort.by("name"));
    // TODO: 이름순 말고 인기순으로 바꾸죠
    List<String> keywordNames = keywordService.searchKeywordsByPrefix(prefix, pageable).stream()
        .map(keyword -> keyword.getName())
        .collect(Collectors.toList());
    return ResponseEntity.ok(keywordNames);
  }
}
