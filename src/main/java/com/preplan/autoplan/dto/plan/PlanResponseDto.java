package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.dto.member.MemberResponseDto;
import com.preplan.autoplan.dto.route.RouteResponseDto;

import java.time.LocalDateTime;
import java.util.List;


//계획 정보 반환용
public record PlanResponseDto(
    Long id,
    MemberResponseDto member,
    String region,
    LocalDateTime startTime,
    LocalDateTime endTime,
    List<String> purposeKeywords,
    List<String> moodKeywords,
    List<RouteResponseDto> routes,
    Integer likes,
    Integer bookmarks,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {

}