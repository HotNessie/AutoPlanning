package com.preplan.autoplan.dto.place;

//장소 추가 or 기존 장소 참조
public record PlaceCreateRequestDto(
    String placeId,
    String name,
    String address,
    Double latitude,
    Double longitude
/*
 * String regionName, // 아마 formatAddress에서 가져오려고 한듯?
 * String regionType
 */
) {
}