package com.preplan.autoplan.dto.place;

import java.util.List;

//정소 정보 반환용. 검색, 추천, 계획 내부 장소 반환
public record PlaceResponseDto(
    Long id,
    String placeId,
    String name,
    String address,
    Double latitude,
    Double longitude,
    Integer searchCount,
    List<String> topPurposeKeywords,
    List<String> topMoodKeywords,
    Long averageStayTime
) {

}