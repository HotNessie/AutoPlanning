package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.dto.route.RouteCreateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public record PlanCreateRequestDto(
    @NotBlank(message = "지역명은 필수입니다.")
    String regionName,

    @NotBlank(message = "계획 제목은 필수입니다.")
    String title,

    @NotNull(message = "시작 시간은 필수입니다.")
    LocalDateTime startTime,

    @NotNull(message = "종료 시간은 필수입니다.")
    LocalDateTime endTime,

    List<String> keywords,
    String description,

    @NotEmpty(message = "장소 정보는 최소 하나 이상 포함되어야 합니다.")
    @Valid List<RouteCreateRequestDto> routes) {
}
