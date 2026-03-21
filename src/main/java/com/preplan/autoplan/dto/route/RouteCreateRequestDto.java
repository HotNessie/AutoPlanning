package com.preplan.autoplan.dto.route;

import com.preplan.autoplan.domain.keyword.Transport;

import jakarta.validation.constraints.Min;

// 계획 생성을 위한 개별 경로 정보 DTO
public record RouteCreateRequestDto(
    String placeId,
    int sequence,
    Transport transportMode,
    @Min(0) long stayTime,
    String memo,
    @Min(0) Integer travelTime,
    Integer travelDistance,
    String polyline,
    String transitDetailInfo) {
}
