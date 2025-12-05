package com.preplan.autoplan.repository.keyword;

import com.preplan.autoplan.domain.keyword.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KeywordRepository extends JpaRepository<Keyword, Long> {
  Optional<Keyword> findByName(String name);

  List<Keyword> findByNameStartingWith(String prefix);
}
