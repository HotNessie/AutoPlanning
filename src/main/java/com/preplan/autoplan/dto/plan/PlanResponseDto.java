package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.dto.member.MemberResponseDto;

import java.time.LocalDateTime;
import java.util.List;

//계획 정보 반환용
public record PlanResponseDto(
        Long planId,
        MemberResponseDto member,
        String regionName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        List<String> purposeKeywords,
        List<String> moodKeywords,
        Integer likes,
        Integer bookmarks,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

}