package com.preplan.autoplan.domain.keyword;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Keyword {

  public Keyword(String name) {
    this.name = name;
  }

  // 대표 키워드 설정(사용자가 임의로 입력한 키워드의 경우 관리자가 매핑시키려고 생성해둔거임)
  public void setRepresentativeKeyword(Keyword representativeKeyword) {
    this.representativeKeyword = representativeKeyword;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "keyword_id")
  private Long id;

  @Column(unique = true, nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "representative_keyword_id")
  private Keyword representativeKeyword;

  @OneToMany(mappedBy = "representativeKeyword")
  private List<Keyword> synonyms = new ArrayList<>();
}
