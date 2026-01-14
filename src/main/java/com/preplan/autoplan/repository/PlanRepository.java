package com.preplan.autoplan.repository;

import com.preplan.autoplan.domain.planPlace.Plan;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long>, PlanRepositoryCustom {

  @EntityGraph(attributePaths = { "planKeywords.keyword", "region", "member" })
  Page<Plan> findByMemberId(Long memberId, Pageable pageable);

  List<Plan> findByIsSharedTrue(Sort sort); // 공유된 계획들

  List<Plan> findByRegionId(Long regionId); // 지역으로 찾기

}
