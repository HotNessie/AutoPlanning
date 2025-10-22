package com.preplan.autoplan.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
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

        Page<Plan> findByMemberId(Long memberId, Pageable pageable);

        // 어떤 장소가 들어간 계획을 보고 싶을 수 있잖아 근데 route로 부터 장소를 참조해야됨?
        // placeId를 모르는데... 흠... placeName검색(findByName) -> placeId추출 -> findByPlaceId
        // ->route에서 장소 찾고 planId반환시켜야됨

        List<Plan> findByIsSharedTrue(Sort sort); // 공유된 계획들

        List<Plan> findByRegionId(Long regionId); // 지역으로 찾기

        List<Plan> findByPurposeKeywordsIn(List<String> purposeKeywords); // 목적 키워드로 찾기

        List<Plan> findByMoodKeywordsIn(List<String> moodKeywords); // 감정 키워드로 찾기

        @Query("SELECT DISTINCT p FROM Plan p WHERE (:memberId IS NULL OR p.member.id = :memberId) " +
                        "AND (:regionId IS NULL OR p.region.id = :regionId) " +
                        "AND (:purposeKeywords IS NULL OR EXISTS (SELECT 1 FROM p.purposeKeywords pk WHERE pk IN :purposeKeywords)) "
                        +
                        "AND (:moodKeywords IS NULL OR EXISTS (SELECT 1 FROM p.moodKeywords mk WHERE mk IN :moodKeywords)) "
                        +
                        "AND (:startTime IS NULL OR p.startTime >= :startTime) " +
                        "AND (:endTime IS NULL OR p.endTime <= :endTime)")
        List<Plan> findByCriteria(
                        @Param("memberId") Long memberId,
                        @Param("regionId") Long regionId,
                        @Param("purposeKeywords") List<PurposeField> purposeKeywords,
                        @Param("moodKeywords") List<MoodField> moodKeywords,
                        @Param("startTime") LocalDateTime startTime,
                        @Param("endTime") LocalDateTime endTime,
                        Sort sort); // 복합 검색
}
