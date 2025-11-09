package com.preplan.autoplan.domain.keyword;

import com.preplan.autoplan.domain.planPlace.Plan;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlanKeyword {

    public PlanKeyword(Plan plan, Keyword keyword) {
        this.plan = plan;
        this.keyword = keyword;
    }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "plan_keyword_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "plan_id")
  private Plan plan;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "keyword_id")
  private Keyword keyword;
}
