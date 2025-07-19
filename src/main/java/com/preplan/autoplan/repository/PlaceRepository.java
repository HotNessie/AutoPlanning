package com.preplan.autoplan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.planPlace.Place;

import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long>, PlaceRepositoryCustom {

    Optional<Place> findByPlaceId(String placeId);// PlaceId로 찾는거임

    List<Place> findByName(String name);// 이름으로 찾기

    // 평균 체류 시간으로 찾기(이건 의미 있을 듯? 자동 계획 생성시에)
    List<Place> findByAverageStayTime(Long averageStayTime);

    @Query("SELECT p FROM Place p JOIN p.region r WHERE p.placeId = :placeId")
    Optional<Place> findByPlaceIdWithRegion(@Param("placeId") String placeId);
}
