package com.preplan.autoplan.dto.route;

import com.preplan.autoplan.dto.place.PlaceResponseDto;

//경로 반환
public record RouteResponseDto(
    Integer sequence,
    PlaceResponseDto place,
    String transportMode,
    Long stayTime,
    String memo
) {

}