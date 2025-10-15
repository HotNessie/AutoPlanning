package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.dto.member.MemberResponseDto;

import java.time.LocalDateTime;
import java.util.List;

//계획 정보 반환용
public record PlanResponseDto(
    Long planId,
    MemberResponseDto member,
    String title,
    String regionName,
    LocalDateTime startTime,
    LocalDateTime endTime,
    List<String> purposeKeywords,
    List<String> moodKeywords,
    Integer likes,
    Integer bookmarks,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {
  public static PlanResponseDto fromEntity(Plan plan) {
    return new PlanResponseDto(
        plan.getId(),
        MemberResponseDto.fromEntity(plan.getMember()),
        plan.getTitle(),
        plan.getRegion().getName(),
        plan.getStartTime(),
        plan.getEndTime(),
        plan.getPurposeKeywords().stream().map(Enum::name).toList(),
        plan.getMoodKeywords().stream().map(Enum::name).toList(),
        plan.getLikes(),
        plan.getBookmarks(),
        plan.getCreatedDate(),
        plan.getLastModifiedDate());
  }

}