package com.preplan.autoplan.repository;

import static com.preplan.autoplan.domain.planPlace.QPlace.place;
import static com.preplan.autoplan.domain.planPlace.QRegion.region;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.place.ComplexSearchDto;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.BooleanExpression;

import org.springframework.util.StringUtils;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PlaceRepositoryImpl implements PlaceRepositoryCustom {

  private final JPAQueryFactory queryFactory;

  /*
   * // @Override
   * public List<Place> findByComplexSearch1(ComplexSearchDto searchDto) {
   * 
   * BooleanBuilder builder = new BooleanBuilder();
   * 
   * if (StringUtils.hasText(searchDto.name())) {
   * builder.and(place.name.containsIgnoreCase(searchDto.name()));
   * }
   * if (StringUtils.hasText(searchDto.regionName())) {
   * builder.and(place.region.name.eq(searchDto.regionName()));
   * }
   * if (StringUtils.hasText(searchDto.regionType())) {
   * builder.and(place.address.containsIgnoreCase(searchDto.address()));
   * }
   * if (searchDto.purposeKeywords() != null &&
   * !searchDto.purposeKeywords().isEmpty()) {
   * builder.and(place.topPurposeKeywords.any().in(searchDto.purposeKeywords()));
   * }
   * if (searchDto.moodKeywords() != null && !searchDto.moodKeywords().isEmpty())
   * {
   * builder.and(place.topMoodKeywords.any().in(searchDto.moodKeywords()));
   * }
   * if (searchDto.averageStayTime() != null) { // 근사치로 수정 필요
   * builder.and(place.averageStayTime.eq(searchDto.averageStayTime()));
   * }
   * return queryFactory
   * .selectFrom(place)
   * .where(builder)
   * .orderBy(place.searchCount.desc()) // 검색 횟수로 정렬
   * .fetch();
   * }
   */

  @Override
  public List<Place> findByComplexSearch(ComplexSearchDto searchDto) {

    return queryFactory
        .selectFrom(place)
        .leftJoin(place.region, region).fetchJoin()
        .where(
            nameContains(searchDto.name()),
            regionNameEq(searchDto.regionName()),
            addressContains(searchDto.address()),
            averageStayTimeEq(searchDto.averageStayTime()))
        .distinct()
        .orderBy(place.searchCount.desc())
        .fetch();
  }

  private BooleanExpression nameContains(String name) {
    return StringUtils.hasText(name) ? place.name.containsIgnoreCase(name) : null;
  }

  private BooleanExpression regionNameEq(String regionName) {
    return StringUtils.hasText(regionName) ? place.region.name.eq(regionName) : null;
  }

  private BooleanExpression addressContains(String address) {
    return StringUtils.hasText(address) ? place.address.containsIgnoreCase(address) : null;
  }

  private BooleanExpression averageStayTimeEq(Long averageStayTime) {
    return averageStayTime != null ? place.averageStayTime.eq(averageStayTime) : null;
  }

}