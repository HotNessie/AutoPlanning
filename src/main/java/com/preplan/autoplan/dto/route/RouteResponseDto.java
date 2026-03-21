package com.preplan.autoplan.dto.route;

import com.preplan.autoplan.domain.keyword.Transport;
import com.preplan.autoplan.domain.planPlace.Route;
import com.preplan.autoplan.dto.place.PlaceResponseDto;

//경로 반환
public record RouteResponseDto(
    Long routeId,
    Integer sequence,
    PlaceResponseDto place,
    Transport transportMode,
    Long stayTime,
    String memo,
    Integer travelTime,
    Integer travelDistance,
    String polyline,
    String transitDetailInfo) {
  public static RouteResponseDto fromEntity(Route route) {
    return new RouteResponseDto(
        route.getId(),
        route.getSequence(),
        PlaceResponseDto.fromEntity(route.getPlace()),
        route.getTransportMode(),
        route.getStayTime(),
        route.getMemo(),
        route.getTravelTime(),
        route.getTravelDistance(),
        route.getPolyline(),
        route.getTransitDetailInfo());
  }
}