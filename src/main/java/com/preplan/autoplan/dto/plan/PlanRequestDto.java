package com.preplan.autoplan.dto.plan;

import java.time.LocalDateTime;
import java.util.List;

//계획 검색용 DTO - 검색 키워드만 담음
public record PlanRequestDto(
    String title,
    String memberName,
    String regionName,
    List<String> userKeywords,
    LocalDateTime startTime,
    LocalDateTime endTime) {
}
