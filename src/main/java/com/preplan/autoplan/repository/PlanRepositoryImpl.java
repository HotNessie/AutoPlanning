package com.preplan.autoplan.repository;

import static com.preplan.autoplan.domain.keyword.QKeyword.keyword;
import static com.preplan.autoplan.domain.keyword.QPlanKeyword.planKeyword;
import static com.preplan.autoplan.domain.member.QMember.member;
import static com.preplan.autoplan.domain.planPlace.QPlan.plan;
import static com.preplan.autoplan.domain.planPlace.QRegion.region;

import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.dto.plan.PlanRequestDto;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
@RequiredArgsConstructor
public class PlanRepositoryImpl implements PlanRepositoryCustom {

  private final JPAQueryFactory queryFactory;

  /**
   * Plan 복합 검색
   */
  @Override
  public Page<Plan> findByCriteria(PlanRequestDto searchCond, Pageable pageable) {
    // 1. 데이터 조회를 위한 메인 쿼리
    List<Plan> content = queryFactory
        .selectFrom(plan)
        .leftJoin(plan.member, member).fetchJoin() // N+1 문제 방지를 위해 fetchJoin 사용
        .leftJoin(plan.region, region).fetchJoin()
        .leftJoin(plan.planKeywords, planKeyword)
        .leftJoin(planKeyword.keyword, keyword)
        .where(
            // 2. 동적 WHERE 절 생성
            titleContains(searchCond.title()),
            memberNameEq(searchCond.memberName()),
            regionContains(searchCond.regionName()),
            userKeywordsContains(searchCond.userKeywords()),
            startTimeGoe(searchCond.startTime()),
            endTimeLoe(searchCond.endTime()))
        .distinct() // 3. 중복된 Plan 제거
        .offset(pageable.getOffset()) // 4. 페이징 적용
        .limit(pageable.getPageSize())
        .fetch();

    // 5. 총 데이터 수 조회
    JPAQuery<Long> countQuery = queryFactory
        .select(plan.countDistinct())
        .from(plan)
        .leftJoin(plan.planKeywords, planKeyword)
        .where(
            titleContains(searchCond.title()),
            memberNameEq(searchCond.memberName()),
            regionContains(searchCond.regionName()),
            userKeywordsContains(searchCond.userKeywords()),
            startTimeGoe(searchCond.startTime()),
            endTimeLoe(searchCond.endTime()));

    // 6. Page 객체 생성 및 반환
    return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
  }

  private BooleanExpression titleContains(String title) {
    return StringUtils.hasText(title) ? plan.title.containsIgnoreCase(title) : null;
  }

  private BooleanExpression memberNameEq(String memberName) {
    return StringUtils.hasText(memberName) ? member.name.eq(memberName) : null;
  }

  private BooleanExpression regionContains(String regionName) {
    return StringUtils.hasText(regionName) ? region.name.containsIgnoreCase(regionName) : null;
  }

  private BooleanExpression startTimeGoe(LocalDateTime startTime) {
    return startTime != null ? plan.startTime.goe(startTime) : null;
    // greater or equal
  }

  private BooleanExpression endTimeLoe(LocalDateTime endTime) {
    return endTime != null ? plan.endTime.loe(endTime) : null;
    // less or equal
  }

  //
  private BooleanExpression userKeywordsContains(List<String> userKeywords) {
    if (userKeywords == null || userKeywords.isEmpty() || userKeywords.stream()
        .allMatch(s -> !StringUtils.hasText(s))) {
      return null;
    }

    BooleanExpression combinedExpression = null;

    for (String keywordStr : userKeywords) {
      if (StringUtils.hasText(keywordStr)) {
        BooleanExpression expression = planKeyword.keyword.name.containsIgnoreCase(keywordStr);
        if (combinedExpression == null) {
          combinedExpression = expression;
        } else {
          combinedExpression = combinedExpression.or(expression);
        }
      }
    }
    return combinedExpression;
  }
}
