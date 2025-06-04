package com.preplan.autoplan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.planPlace.Place;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    Optional<Place> findByPlaceId(String placeId);// PlaceId로 찾는거임

    List<Place> findByName(String name);// 이름으로 찾기

    List<Place> findByPurposeKeywords(List<PurposeField> topPurposeKeywords); // 목적 키워드로 찾기

    List<Place> findByMoodKeywords(List<MoodField> topMoodKeywords); // 감정 키워드로 찾기

    List<Place> findByRegionName(String regionName); // 지역 이름으로 찾기

//    List<Place> findByAddress(String address); // 주소로 찾기

    // 평균 체류 시간으로 찾기(이건 의미 있을 듯? 자동 계획 생성시에)
    List<Place> findByAverageStayTime(Long averageStayTime);

    @Query("SELECT p FROM Place p WHERE " +
        "(:name IS NULL OR p.name LIKE CONCAT('%', :name, '%')) " +
        "AND (:regionId IS NULL OR p.region.id = :regionId) " +
        "AND (COALESCE(:purposeKeywords, NULL) IS NULL OR EXISTS (SELECT 1 FROM p.topPurposeKeywords tpk WHERE tpk IN :purposeKeywords)) "
        +
        "AND (COALESCE(:moodKeywords, NULL) IS NULL OR EXISTS (SELECT 1 FROM p.topMoodKeywords tmk WHERE tmk IN :moodKeywords))")
    List<Place> findByCriteria(
        @Param("name") String name,
        @Param("regionId") Long regionId,
        @Param("purposeKeywords") List<PurposeField> purposeKeywords,
        @Param("moodKeywords") List<MoodField> moodKeywords);
    // 더 있을 수 있음 몬가 목적에 따라서 어떻게 찾을지 모르니껜
}
