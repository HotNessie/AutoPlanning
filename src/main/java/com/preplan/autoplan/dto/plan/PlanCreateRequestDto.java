package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.dto.route.RouteCreateRequestDto;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

public record PlanCreateRequestDto(
    String regionName,
    String title,
    LocalDateTime startTime,
    LocalDateTime endTime,
    List<String> keywords,
    String description,
    @Valid List<RouteCreateRequestDto> routes) {
}
