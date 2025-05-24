package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

  private final GoogleRouteClient googleRouteClient;

  @Value("${google.route.field-mask}")
  private String routeFieldMask;

  // 경로 계산
  @Transactional
  public ComputeRoutesResponse computeRoutes(ComputeRoutesRequest request) {
    log.info("Computing 확인:{}", request);
    List<ComputeRoutesResponse> responses = new ArrayList<>();
    List<ComputeRoutesRequest.PlaceInfo> places = request.placeNames();
    LocalDateTime currentDeparture = request.departureTime();

    for (int i = 0; i < places.size() - 1; i++) {
      ComputeRoutesRequest.PlaceInfo start = places.get(i);
      Transport mode = start.transport() != null ? start.transport() : Transport.TRANSIT;

      if (mode == Transport.TRANSIT) {
        ComputeRoutesResponse response = computeTransitRoute(start, places.get(i + 1), currentDeparture, request);
        responses.add(response);
        currentDeparture = updateDepartureTime(response, currentDeparture, start.time());
      } else if (mode == Transport.DRIVE) {
        int j = i;
        List<ComputeRoutesRequest.PlaceInfo> intermediates = new ArrayList<>();
        while (j < places.size() - 1 && places.get(j).transport() == Transport.DRIVE) {
          if (j > i)
            intermediates.add(places.get(j));
          j++;
        }
        ComputeRoutesResponse response = computeDriveRoute(start, places.get(j), intermediates, currentDeparture,
            request);
        responses.add(response);
        currentDeparture = updateDepartureTime(response, currentDeparture, start.time());
        i = j - 1;
      }
    }
    return combineResponses(responses);
  }

  // // TRANSIT 모드 경로 계산
  private ComputeRoutesResponse computeTransitRoute(
      ComputeRoutesRequest.PlaceInfo origin,
      ComputeRoutesRequest.PlaceInfo destination,
      LocalDateTime departureTime,
      ComputeRoutesRequest request) {
    GoogleRoutesRequest apiRequest = createTransitRequest(origin, destination, departureTime, request);
    return googleRouteClient.getRoute(routeFieldMask, apiRequest);
  }

  // // DRIVE 모드 경로 계산
  private ComputeRoutesResponse computeDriveRoute(
      ComputeRoutesRequest.PlaceInfo origin,
      ComputeRoutesRequest.PlaceInfo destination,
      List<ComputeRoutesRequest.PlaceInfo> intermediates,
      LocalDateTime departureTime,
      ComputeRoutesRequest request) {
    List<GoogleRoutesRequest.Place> intermediatePlaces = intermediates.stream()
        .map(this::toPlace)
        .toList();
    GoogleRoutesRequest apiRequest = createRequest(origin, destination, intermediatePlaces, Transport.DRIVE,
        departureTime,
        request);
    return googleRouteClient.getRoute(routeFieldMask, apiRequest);
  }

  // 공통 요청 생성 메서드
  private GoogleRoutesRequest createRequest(
      ComputeRoutesRequest.PlaceInfo origin,
      ComputeRoutesRequest.PlaceInfo destination,
      List<GoogleRoutesRequest.Place> intermediates,
      Transport travelMode,
      LocalDateTime departureTime,
      ComputeRoutesRequest originalRequest) {
    String departureTimeStr = departureTime != null
        ? departureTime.atZone(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT)
        : null;
    return new GoogleRoutesRequest(
        toPlace(origin),
        toPlace(destination),
        intermediates,
        travelMode.name(),
        departureTimeStr,
        originalRequest.routingPreference(),
        originalRequest.units());
  }

  // TRANSIT 모드 요청 생성
  private GoogleRoutesRequest createTransitRequest(
      ComputeRoutesRequest.PlaceInfo origin,
      ComputeRoutesRequest.PlaceInfo destination,
      LocalDateTime departureTime,
      ComputeRoutesRequest originalRequest) {
    return createRequest(origin, destination, null, Transport.TRANSIT,
        departureTime, originalRequest);
  }

  // 출발 시간 업데이트
  private LocalDateTime updateDepartureTime(ComputeRoutesResponse response,
      LocalDateTime currentDeparture,
      Integer stayTime) {
    long travelDurationSeconds = Long.parseLong(response.routes().get(0).duration().replace("s", ""));
    return currentDeparture != null
        ? currentDeparture.plusSeconds(travelDurationSeconds).plusMinutes(stayTime != null ? stayTime : 0)
        : LocalDateTime.now().plusSeconds(travelDurationSeconds).plusMinutes(stayTime != null ? stayTime : 0);
  }

  // Place 객체 변환
  private GoogleRoutesRequest.Place toPlace(ComputeRoutesRequest.PlaceInfo info) {
    return new GoogleRoutesRequest.Place(
        info.placeId(),
        info.location() != null ? new GoogleRoutesRequest.Place.Location(
            new GoogleRoutesRequest.Place.Location.LatLng(
                info.location().latLng().latitude(),
                info.location().latLng().longitude()))
            : null);
  }

  // 응답 결합
  private ComputeRoutesResponse combineResponses(List<ComputeRoutesResponse> responses) {
    int totalDistance = responses.stream()
        .mapToInt(response -> response.routes().get(0).distanceMeters())
        .sum();
    long totalDuration = responses.stream()
        .mapToLong(response -> Long.parseLong(response.routes().get(0).duration().replace("s", "")))
        .sum();

    List<ComputeRoutesResponse.Route.Leg> combinedLegs = new ArrayList<>();
    for (ComputeRoutesResponse response : responses) {
      combinedLegs.addAll(response.routes().get(0).legs());
    }
    StringBuilder polyline = new StringBuilder();
    for (ComputeRoutesResponse response : responses) {
      for (ComputeRoutesResponse.Route.Leg leg : response.routes().get(0).legs()) {
        polyline.append(leg.polyline().encodedPolyline());
      }
    }
    ComputeRoutesResponse.Route combinedRoute = new ComputeRoutesResponse.Route(
        totalDistance,
        totalDuration + "s",
        new ComputeRoutesResponse.Polyline(polyline.toString()),
        combinedLegs);

    return new ComputeRoutesResponse(List.of(combinedRoute));
  }

  // // TRANSIT 모드 요청 생성
  // private GoogleRoutesRequest createTransitRequest(
  // ComputeRoutesRequest.PlaceInfo origin,
  // ComputeRoutesRequest.PlaceInfo destination,
  // LocalDateTime departureTime,
  // ComputeRoutesRequest originalRequest) {
  // return createRequest(origin, destination, null, Transport.TRANSIT,
  // departureTime, originalRequest);
  // }

  // // DRIVE 모드 요청 생성
  // private GoogleRoutesRequest createDriveRequest(
  // ComputeRoutesRequest.PlaceInfo origin,
  // ComputeRoutesRequest.PlaceInfo destination,
  // List<ComputeRoutesRequest.PlaceInfo> intermediates,
  // LocalDateTime departureTime,
  // ComputeRoutesRequest originalRequest) {
  // List<GoogleRoutesRequest.Place> intermediatePlaces = intermediates.stream()
  // .map(this::toPlace)
  // .toList();
  // return createRequest(origin, destination, intermediatePlaces,
  // Transport.DRIVE, departureTime, originalRequest);
  // }

  // // 공통 요청 생성 메서드
  // private GoogleRoutesRequest createRequest(
  // ComputeRoutesRequest.PlaceInfo origin,
  // ComputeRoutesRequest.PlaceInfo destination,
  // List<GoogleRoutesRequest.Place> intermediates,
  // Transport travelMode,
  // LocalDateTime departureTime,
  // ComputeRoutesRequest originalRequest) {
  // String departureTimeStr = departureTime != null
  // ? departureTime.atZone(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT)
  // : null;
  // return new GoogleRoutesRequest(
  // toPlace(origin),
  // toPlace(destination),
  // intermediates,
  // travelMode.name(),
  // departureTimeStr,
  // originalRequest.routingPreference(),
  // originalRequest.units());
  // }

  // // 출발 시간 업데이트
  // private LocalDateTime updateDepartureTime(ComputeRoutesResponse response,
  // LocalDateTime currentDeparture,
  // Integer stayTime) {
  // long travelDurationSeconds =
  // Long.parseLong(response.routes().get(0).duration().replace("s", ""));
  // return currentDeparture != null
  // ? currentDeparture.plusSeconds(travelDurationSeconds).plusMinutes(stayTime !=
  // null ? stayTime : 0)
  // : LocalDateTime.now().plusSeconds(travelDurationSeconds).plusMinutes(stayTime
  // != null ? stayTime : 0);
  // }

  // // Place 객체 변환
  // private GoogleRoutesRequest.Place toPlace(ComputeRoutesRequest.PlaceInfo
  // info) {
  // return new GoogleRoutesRequest.Place(
  // info.placeId(),
  // info.location() != null ? new GoogleRoutesRequest.Place.Location(
  // new GoogleRoutesRequest.Place.Location.LatLng(
  // info.location().latLng().latitude(),
  // info.location().latLng().longitude()))
  // : null);
  // }

  // // 응답 결합
  // private ComputeRoutesResponse combineResponses(List<ComputeRoutesResponse>
  // responses) {
  // int totalDistance = responses.stream()
  // .mapToInt(response -> response.routes().get(0).distanceMeters())
  // .sum();
  // long totalDuration = responses.stream()
  // .mapToLong(response ->
  // Long.parseLong(response.routes().get(0).duration().replace("s", "")))
  // .sum();

  // List<ComputeRoutesResponse.Route.Leg> combinedLegs = new ArrayList<>();
  // for (ComputeRoutesResponse response : responses) {
  // combinedLegs.addAll(response.routes().get(0).legs());
  // }
  // StringBuilder polyline = new StringBuilder();
  // for (ComputeRoutesResponse response : responses) {
  // for (ComputeRoutesResponse.Route.Leg leg : response.routes().get(0).legs()) {
  // polyline.append(leg.polyline().encodedPolyline());
  // }
  // }
  // ComputeRoutesResponse.Route combinedRoute = new ComputeRoutesResponse.Route(
  // totalDistance,
  // totalDuration + "s",
  // new ComputeRoutesResponse.Polyline(polyline.toString()),
  // combinedLegs);

  // return new ComputeRoutesResponse(List.of(combinedRoute));
  // }
}
