package com.preplan.autoplan.dto.place;

//장소 추가 or 기존 장소 참조
public record PlaceCreateRequestDto(
    String placeId,
    String name,
    String address,
    Double latitude,
    Double longitude
) {

}