package com.preplan.autoplan.repository;

import com.preplan.autoplan.domain.planPlace.Plan;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long>, PlanRepositoryCustom {

  @EntityGraph(attributePaths = { "planKeywords.keyword", "region", "member" })
  Page<Plan> findByMemberId(Long memberId, Pageable pageable);

  List<Plan> findByIsSharedTrue(Sort sort); // 공유된 계획들

  List<Plan> findByRegionId(Long regionId); // 지역으로 찾기

  // 특정 장소(Google placeId)를 포함한 공개된 계획들을 조회 (N+1 방지)
  @Query("SELECT DISTINCT p FROM Plan p " +
      "JOIN Route r ON r.plan = p " +
      "JOIN r.place pl " +
      "WHERE pl.placeId = :placeId AND p.isShared = true")
  List<Plan> findAllByPlaceId(@Param("placeId") String placeId);

}
