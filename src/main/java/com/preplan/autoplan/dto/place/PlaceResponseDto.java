package com.preplan.autoplan.dto.place;

import java.util.List;
import java.util.stream.Collectors;

import com.preplan.autoplan.domain.planPlace.Place;

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
    Long averageStayTime,
    Long regionId) {
  public static PlaceResponseDto fromEntity(Place place) {
    return new PlaceResponseDto(
        place.getId(),
        place.getPlaceId(),
        place.getName(),
        place.getAddress(),
        place.getLatitude(),
        place.getLongitude(),
        place.getSearchCount(),
        place.getTopPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
        place.getTopMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
        place.getAverageStayTime(),
        place.getRegion().getId());
  }

  public static List<PlaceResponseDto> fromEntities(List<Place> places) {
    return places.stream().map(PlaceResponseDto::fromEntity).collect(Collectors.toList());
  }
}