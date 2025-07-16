package com.preplan.autoplan.dto.route;

// 계획 생성을 위한 개별 경로 정보 DTO
public record RouteCreateRequestDto(
    String placeId,
    int sequence,
    String transportMode,
    long stayTime,
    String memo,
    Integer travelTime,
    Integer travelDistance
) {
}
