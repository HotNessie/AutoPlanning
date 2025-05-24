package com.preplan.autoplan.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.planPlace.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
  List<Plan> findByMemberId(Long memberId);

  List<Plan> findByPlaceId(Long placeId); // 어떤 장소가 들어간 계획을 보고 싶을 수 있잖아

  List<Plan> findByIsSharedTrue(Sort sort); // 공유된 계획들

  List<Plan> findByRegion(String region); // 지역으로 찾기

  List<Plan> findByPurposeKeywordsIn(List<String> purposeKeywords); // 목적 키워드로 찾기

  List<Plan> findByMoodKeywordsIn(List<String> moodKeywords); // 감정 키워드로 찾기

  @Query("SELECT p FROM Plan p WHERE (:memberId IS NULL OR p.member.id = :memberId) " +
      "AND (:region IS NULL OR p.region = :region) " +
      "AND (:purposeKeywords IS NULL OR p.purposeKeywords IN :purposeKeywords) " +
      "AND (:moodKeywords IS NULL OR p.moodKeywords IN :moodKeywords)" +
      "AND (:startTime IS NULL OR p.startTime >= :startTime) " +
      "AND (:endTime IS NULL OR p.endTime <= :endTime)")
  List<Plan> findByCriteria(
      @Param("memberId") Long memberId,
      @Param("region") String region,
      @Param("purposeKeywords") List<String> purposeKeywords,
      @Param("moodKeywords") List<String> moodKeywords,
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime,
      Sort sort); // 복합 검색
}
