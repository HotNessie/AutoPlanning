package com.preplan.autoplan.dto.placeKeyword;

//장소의 키워드와 빈도
public record PlaceKeywordResponseDto(
    Long id,
    Long placeId,
    String purposeKeyword,
    String moodKeyword,
    Integer count
) {

}