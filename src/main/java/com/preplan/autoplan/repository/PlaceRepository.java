package com.preplan.autoplan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.plan.PlanResponseDto;

import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long>, PlaceRepositoryCustom {

  Optional<Place> findByPlaceId(String placeId);// PlaceId로 찾는거임

  List<Place> findByName(String name);// 장소 이름으로 찾기

  // 평균 체류 시간으로 찾기(이건 의미 있을 듯? 자동 계획 생성시에)
  List<Place> findByAverageStayTime(Long averageStayTime);

  @Query("SELECT p FROM Place p JOIN p.region r WHERE p.placeId = :placeId")
  Optional<Place> findByPlaceIdWithRegion(@Param("placeId") String placeId);

  // 검색 횟수 순으로 상위 장소 조회
  List<Place> findTop10ByOrderBySearchCountDesc();

  // 특정 시/군/구(City) 내에서 인기 장소 조회
  List<Place> findTop5ByCityRegionIdOrderBySearchCountDesc(Long cityRegionId);

}
