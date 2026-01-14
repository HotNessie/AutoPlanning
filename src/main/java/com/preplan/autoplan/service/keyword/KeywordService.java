package com.preplan.autoplan.service.keyword;

import com.preplan.autoplan.domain.keyword.Keyword;
import com.preplan.autoplan.repository.keyword.KeywordRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KeywordService {

  private final KeywordRepository keywordRepository;

  public Optional<Keyword> findByName(String name) {
    return keywordRepository.findByName(name);
  }

  @Transactional
  public Keyword save(Keyword keyword) {
    return keywordRepository.save(keyword);
  }

  public Page<Keyword> searchKeywordsByPrefix(String prefix, Pageable pageable) {
    return keywordRepository.findByNameStartingWith(prefix, pageable);
  }
}
