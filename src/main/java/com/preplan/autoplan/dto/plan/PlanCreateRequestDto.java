package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.dto.route.RouteCreateRequestDto;
import java.time.LocalDateTime;
import java.util.List;

public record PlanCreateRequestDto(
        String regionName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        List<String> purposeKeywords,
        List<String> moodKeywords,
        List<RouteCreateRequestDto> routes) {
}
