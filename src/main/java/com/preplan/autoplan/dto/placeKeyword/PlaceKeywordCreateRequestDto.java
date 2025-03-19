package com.preplan.autoplan.dto.placeKeyword;

//장소에 키워드 추가용
public record PlaceKeywordCreateRequestDto(
    Long placeId,
    String purposeKeyword,
    String moodKeyword
) {

}