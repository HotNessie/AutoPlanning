package com.preplan.autoplan.dto.route;

import com.preplan.autoplan.domain.planPlace.Route;
import com.preplan.autoplan.dto.place.PlaceResponseDto;

//경로 반환
public record RouteResponseDto(
    Integer sequence,
    PlaceResponseDto place,
    String transportMode,
    Long stayTime,
    String memo,
    Integer travelTime,
    Integer travelDistance,
    String polyline) {
  public static RouteResponseDto fromEntity(Route route) {
    return new RouteResponseDto(
        route.getSequence(),
        PlaceResponseDto.fromEntity(route.getPlace()),
        route.getTransportMode(),
        route.getStayTime(),
        route.getMemo(),
        route.getTravelTime(),
        route.getTravelDistance(),
        route.getPolyline());
  }
}