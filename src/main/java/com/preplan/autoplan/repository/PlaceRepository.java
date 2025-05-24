package com.preplan.autoplan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.planPlace.Place;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
  Optional<Place> findByPlaceId(String placeId);// 이건 의미가 있나

  List<Place> findByName(String name);

  List<Place> findByTopPurposeKeywordsIn(List<String> purposeKeywords); // 목적 키워드로 찾기

  List<Place> findByTopMoodKeywordsIn(List<String> moodKeywords); // 감정 키워드로 찾기

  List<Place> findByRegion(String region); // 지역으로 찾기

  List<Place> findByAverageStayTime(Long averageStayTime); // 평균 체류 시간으로 찾기(이건 의미 있을 듯? 자동 계획 생성시에)

  @Query("SELECT p FROM Place p WHERE( :name IS NULL OR p.name LIKE %:name%)" +
      "And(:region IS NULL OR p.region = :region)" +
      "And(:purposeKeywords IS NULL OR p.topPurposeKeywords IN :purposeKeywords)" +
      "And(:moodKeywords IS NULL OR p.topMoodKeywords IN :moodKeywords)")
  List<Place> findByCriteria(
      @Param("name") String name,
      @Param("purposeKeywords") List<String> purposeKeywords,
      @Param("moodKeywords") List<String> moodKeywords,
      @Param("region") String region); // 복합
  // 더 있을 수 있음 몬가 목적에 따라서 어떻게 찾을지 모르니껜

}
