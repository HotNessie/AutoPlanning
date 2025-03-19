package com.preplan.autoplan.dto.route;

//계획 생성 수정용
public record RouteCreateRequestDto(
    String placeId,
    Integer sequence,
    String transportMode,
    Long stayTime,
    String memo
) {

}