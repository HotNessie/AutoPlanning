package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.domain.planPlace.Route;
import com.preplan.autoplan.dto.route.RouteReorderDto;
import com.preplan.autoplan.dto.route.RouteResponseDto;
import com.preplan.autoplan.exception.RouteComputationException;
import com.preplan.autoplan.exception.RouteNotFoundException;
import com.preplan.autoplan.googleApi.ComputeRoutesRequest.PlaceInfo;
import com.preplan.autoplan.googleApi.ComputeRoutesRequest.PlaceInfo.Location;
import com.preplan.autoplan.googleApi.ComputeRoutesRequest.PlaceInfo.Location.Latlng;
import com.preplan.autoplan.googleApi.ComputeRoutesResponse.Leg;
import com.preplan.autoplan.repository.PlanRepository;
import com.preplan.autoplan.repository.RouteRepository;
import com.preplan.autoplan.service.PlaceService;
import com.preplan.autoplan.service.PlanService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

  private final GoogleRouteClient googleRouteClient;
  private final RouteRepository routeRepository;
  private final PlanService planService;
  private final PlaceService placeService;
  private final PlanRepository planRepository;

  @Value("${google.route.field-mask}")
  private String routeFieldMask;

  // Title - 경로 계산 with 캐싱
  @Transactional
  @Cacheable(value = "routes", key = "#request.hashCode()")
  @Retryable(retryFor = { Exception.class }, maxAttempts = 2, backoff = @Backoff(delay = 1000))
  public ComputeRoutesResponse computeRoutes(ComputeRoutesRequest request) {
    log.info("Computing routes for request: {}", request);

    // 입력 검증
    // routeValidationService.validateRequest(request);

    List<ComputeRoutesResponse> responses = new ArrayList<>();// 답변 리스트
    List<ComputeRoutesRequest.PlaceInfo> places = request.placeNames();// 요청 장소 리스트
    LocalDateTime currentDeparture = request.departureTime();// 현재 출발 시간

    try {
      for (int i = 0; i < places.size() - 1; i++) {// 장소 돌리면서
        ComputeRoutesRequest.PlaceInfo start = places.get(i);
        // 현재 장소의 교통수단이 없으면 기본값으로 TRANSIT 설정
        Transport mode = start.transport() != null ? start.transport() : Transport.TRANSIT;

        // TRANSIT 모드일 때 출발 시간이 과거면 현재 시간으로 보정 (구글 API 제약)
        if (mode == Transport.TRANSIT && currentDeparture != null && currentDeparture.isBefore(LocalDateTime.now())) {
          currentDeparture = LocalDateTime.now();
          log.info("Adjusted past departure time to now for TRANSIT mode");
        }

        ComputeRoutesResponse response = switch (mode) {
          // 교통수단에 따라 다른 경로 계산
          // TRANSIT 모드
          case TRANSIT -> computeTransitRoute(start, places.get(i + 1), currentDeparture, request);
          // DRIVE 모드
          case DRIVE -> {
            int endPoint = findDriveSequenceEnd(places, i);
            List<ComputeRoutesRequest.PlaceInfo> intermediates = extractIntermediates(
                places, i, endPoint); // DRIVE가 연속되어있다면 경유지 설정
            ComputeRoutesResponse driveResponse = computeDriveRoute(start,
                places.get(endPoint), intermediates,
                currentDeparture, request);
            i = endPoint - 1; // 연속된 DRIVE 구간 건너뛰기 ( 다음 i는 다른 transport로 시작 )
            yield driveResponse;
          }
          case WALK -> computeWalkRoute(start, places.get(i + 1), currentDeparture, request);
        };

        if (response.routes() == null || response.routes().isEmpty()) {
          throw new RouteComputationException("경로를 찾을 수 없습니다 for segment: " + start + " to " + places.get(i + 1));
        }

        responses.add(response);
        currentDeparture = updateDepartureTime(response, currentDeparture, start.time());
      }

      return combineResponses(responses);
    } catch (RouteComputationException e) {
      log.error("Error computing routes: ", e);
      throw new RouteComputationException("경로 계산 중 오류가 발생했습니다: " + e.getMessage());
    } catch (Exception e) {
      log.error("Unexpected error computing routes: ", e);
      throw new RouteComputationException("예기치 못한 오류가 발생했습니다: " + e.getMessage());
    }
  }

  // 비동기 경로 계산 (대용량 요청용)
  public CompletableFuture<ComputeRoutesResponse> computeRoutesAsync(
      ComputeRoutesRequest request) {
    return CompletableFuture.supplyAsync(() -> computeRoutes(request));
  }

  // TRANSIT 모드 경로 계산
  private ComputeRoutesResponse computeTransitRoute(
      ComputeRoutesRequest.PlaceInfo origin,
      ComputeRoutesRequest.PlaceInfo destination,
      LocalDateTime departureTime,
      ComputeRoutesRequest request) {

    GoogleRoutesRequest apiRequest = createRequest(origin, destination, null, Transport.TRANSIT,
        departureTime, request);
    // GoogleRoutesRequest apiRequest = createTransitRequest(origin, destination,
    // departureTime, request);
    return googleRouteClient.getRoute(routeFieldMask, apiRequest);
  }

  // DRIVE 모드 경로 계산
  private ComputeRoutesResponse computeDriveRoute(
      ComputeRoutesRequest.PlaceInfo origin,
      ComputeRoutesRequest.PlaceInfo destination,
      List<ComputeRoutesRequest.PlaceInfo> intermediates,
      LocalDateTime departureTime,
      ComputeRoutesRequest request) {
    List<GoogleRoutesRequest.Place> intermediatePlaces = intermediates.stream()
        .map(this::toPlace)
        .toList();
    GoogleRoutesRequest apiRequest = createRequest(origin, destination, intermediatePlaces,
        Transport.DRIVE,
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
        ? departureTime.atZone(ZoneId.systemDefault()).toInstant().toString()
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

  // 출발 시간 업데이트
  private LocalDateTime updateDepartureTime(ComputeRoutesResponse response,
      LocalDateTime currentDeparture,
      Integer stayTime) {
    long travelDurationSeconds = Long.parseLong(
        response.routes().get(0).duration().replace("s", ""));
    return currentDeparture != null
        ? currentDeparture.plusSeconds(travelDurationSeconds)
            .plusMinutes(stayTime != null ? stayTime : 0)
        : LocalDateTime.now().plusSeconds(travelDurationSeconds)
            .plusMinutes(stayTime != null ? stayTime : 0);
  }

  // Place 객체 변환
  private GoogleRoutesRequest.Place toPlace(ComputeRoutesRequest.PlaceInfo info) {
    if (info.placeId() != null && !info.placeId().isEmpty()) {
      return new GoogleRoutesRequest.Place(info.placeId(), null);
    }
    if (info.location() != null) {
      return new GoogleRoutesRequest.Place(null, new GoogleRoutesRequest.Place.Location(
          new GoogleRoutesRequest.Place.Location.LatLng(
              info.location().latLng().latitude(),
              info.location().latLng().longitude())));

    }
    throw new IllegalArgumentException("PlaceInfo must have either placeId or location");
  }

  // 응답 결합
  private ComputeRoutesResponse combineResponses(List<ComputeRoutesResponse> responses) {
    int totalDistance = responses.stream()
        .mapToInt(response -> response.routes().get(0).distanceMeters())
        .sum();
    long totalDuration = responses.stream()
        .mapToLong(
            response -> Long.parseLong(response.routes().get(0).duration().replace("s", "")))
        .sum();

    List<Leg> combinedLegs = new ArrayList<>();
    for (ComputeRoutesResponse response : responses) {
      combinedLegs.addAll(response.routes().get(0).legs());
    }
    StringBuilder polyline = new StringBuilder();
    for (ComputeRoutesResponse response : responses) {
      for (Leg leg : response.routes().get(0).legs()) {
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

  private int findDriveSequenceEnd(List<ComputeRoutesRequest.PlaceInfo> places, int start) {
    int j = start;
    while (j < places.size() - 1 && places.get(j).transport() == Transport.DRIVE) {
      j++;
    }
    return j;
  }

  private List<ComputeRoutesRequest.PlaceInfo> extractIntermediates(
      List<ComputeRoutesRequest.PlaceInfo> places, int start, int end) {
    List<ComputeRoutesRequest.PlaceInfo> intermediates = new ArrayList<>();
    for (int k = start + 1; k < end; k++) {
      intermediates.add(places.get(k));
    }
    return intermediates;
  }

  private ComputeRoutesResponse computeWalkRoute(
      ComputeRoutesRequest.PlaceInfo origin,
      ComputeRoutesRequest.PlaceInfo destination,
      LocalDateTime departureTime,
      ComputeRoutesRequest request) {
    GoogleRoutesRequest apiRequest = createRequest(origin, destination, null, Transport.WALK,
        departureTime, request);
    return googleRouteClient.getRoute(routeFieldMask, apiRequest);
  }

  // Title - planId로 경로 조회
  public List<RouteResponseDto> findRouteByPlanId(Long planId) {
    return routeRepository.findByPlanIdOrderBySequenceAsc(planId).stream()
        .map(RouteResponseDto::fromEntity)
        .collect(Collectors.toList());
  }

  // Title - Route 메모 수정
  public Route editMemo(Long planId, Integer routeSequence, String memo) {
    Route route = routeRepository.findByPlanIdAndSequence(planId, routeSequence)
        .orElseThrow(() -> new RouteNotFoundException(
            "Route not found with planId: " + planId + " and sequence: " + routeSequence));
    route.setMemo(memo);
    return routeRepository.save(route);

  }

  // Title - 체류시간 수정
  @Transactional
  public void updateStayTime(Long planId, Integer routeSequence, Long stayTime) {
    Route route = routeRepository.findByPlanIdAndSequence(planId, routeSequence)
        .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
            "Route not found with planId: " + planId + " and sequence: " + routeSequence));
    route.setStayTime(stayTime);
    routeRepository.save(route);
  }

  // Title - polyline 수정
  @Transactional
  public void editPolyline(Long planId, Integer routeSequence, String polyline) {
    Route route = routeRepository.findByPlanIdAndSequence(planId, routeSequence)
        .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
            "Route not found with planId: " + planId + " and sequence: " + routeSequence));
    route.setPolyline(polyline);
    routeRepository.save(route);
  }

  // Title - travelTime 수정
  @Transactional
  public void editTravelTime(Long planId, Integer routeSequence, Integer travelTime) {
    Route route = routeRepository.findByPlanIdAndSequence(planId, routeSequence)
        .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
            "Route not found with planId: " + planId + " and sequence: " + routeSequence));
    route.setTravelTime(travelTime);
    routeRepository.save(route);
  }

  // Title - travelDistance 수정
  @Transactional
  public void editTravelDistance(Long planId, Integer routeSequence, Integer travelDistance) {
    Route route = routeRepository.findByPlanIdAndSequence(planId, routeSequence)
        .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
            "Route not found with planId: " + planId + " and sequence: " + routeSequence));
    route.setTravelDistance(travelDistance);
    routeRepository.save(route);
  }

  // TransitDetails를 보기 좋은 문자열로 변환하는 헬퍼 메소드 추가
  public String formatTransitDetails(ComputeRoutesResponse.TransitDetails transitDetails) {
    if (transitDetails == null || transitDetails.transitLine() == null) {
      return null;
    }
    String name = transitDetails.transitLine().name();
    String shortName = transitDetails.transitLine().shortName();

    if (name != null && !name.isEmpty()) {
      if (shortName != null && !shortName.isEmpty() && !name.contains(shortName)) {
        return name + " (" + shortName + ")";
      }
      return name;
    }
    return shortName;
  }

  // Title - 기존 계획에 장소 추가
  @Transactional
  public void addPlacesToPlan(Long planId, ComputeRoutesRequest request) {
    // 1. Plan 및 기존 경로 조회
    Plan plan = planService.findById(planId);
    List<Route> existingRoutes = routeRepository.findByPlanIdOrderBySequenceAsc(planId);
    if (existingRoutes.isEmpty()) {
      throw new IllegalStateException("기존 경로가 없는 계획에는 장소를 추가할 수 없습니다.");
    }
    Route lastRoute = existingRoutes.get(existingRoutes.size() - 1);

    List<Place> newPlaces = request.placeNames().stream()
        .map(p -> placeService.findByPlaceId(p.placeId()))
        .collect(Collectors.toList());

    // 2. 경로 계산 요청 DTO 생성
    List<PlaceInfo> placeInfosForCalc = new ArrayList<>();

    // 기존 마지막 장소
    Place lastPlace = lastRoute.getPlace();
    // 이거 좀 개떡같네;;
    Location lastLatLng = new Location(new Latlng(lastPlace.getLatitude(), lastPlace.getLongitude()));

    // !교통수단은 서비스 범위 늘리면 처리 해야 됨
    placeInfosForCalc.add(new PlaceInfo(
        lastPlace.getName(),
        lastPlace.getPlaceId(),
        lastRoute.getTransportMode() != null ? lastRoute.getTransportMode() : Transport.TRANSIT,
        lastRoute.getStayTime().intValue(),
        lastLatLng));

    // 프론트에서 받은 새로운 장소들 추가
    placeInfosForCalc.addAll(request.placeNames());

    ComputeRoutesRequest finalComputeRequest = new ComputeRoutesRequest(
        placeInfosForCalc,
        plan.getEndTime(), // 마지막 장소에서 출발하는 시간이므로 plan의 endTime이 출발시간
        null,
        request.units() != null ? request.units() : "METRIC");

    // 4. 경로 계산 routeService computeRoutes 호출
    ComputeRoutesResponse computedResult = computeRoutes(finalComputeRequest);

    // 계산된 경로에서 legs 추출
    List<Leg> legs = computedResult.routes().get(0).legs();

    // 5. 새로운 Route 생성 및 저장
    long totalNewDurationSeconds = 0;
    // 첫 번째 leg는 기존 마지막 장소에서 새로 추가된 첫 장소로 가는 경로이므로 따로 처리
    if (!legs.isEmpty()) {
      Leg firstLeg = legs.get(0);
      long travelTimeSeconds = Long.parseLong(firstLeg.duration().replace("s", ""));

      lastRoute.setTravelTime(Math.toIntExact(travelTimeSeconds / 60));
      lastRoute.setTravelDistance(firstLeg.distanceMeters());
      lastRoute.setPolyline(firstLeg.polyline().encodedPolyline());

      if (lastRoute.getTransportMode() == Transport.TRANSIT) {
        String transitInfo = firstLeg.steps().stream()
            .filter(step -> step.transitDetails() != null)
            .map(step -> formatTransitDetails(step.transitDetails()))
            .filter(Objects::nonNull)
            .collect(Collectors.joining(", "));
        lastRoute.setTransitDetailInfo(transitInfo);
      }
      routeRepository.save(lastRoute);
    }

    // 각 leg와 place 매칭
    List<Route> newRoutesToSaveList = new ArrayList<>();
    for (int i = 0; i < request.placeNames().size(); i++) {
      Place currentPlace = newPlaces.get(i);
      PlaceInfo currentPlaceInfo = request.placeNames().get(i);
      long stayTimeMinutes = currentPlaceInfo.time() != null ? currentPlaceInfo.time() : 60;
      totalNewDurationSeconds += stayTimeMinutes * 60;

      Route newRoute = Route.builder()
          .plan(plan)
          .place(currentPlace)
          .sequence(lastRoute.getSequence() + 1 + i)
          // TODO: 선택사항을 늘리면 수정 해야 됨
          .transportMode(currentPlaceInfo.transport() != null ? currentPlaceInfo.transport() : Transport.TRANSIT)
          .memo("")// 메모는 myPlanDetail에서 작성하도록
          .stayTime(stayTimeMinutes)
          .build();

      // 첫 번째 leg는 이미 처리했으므로 두 번째 leg부터 처리
      if (i < legs.size() - 1) {
        Leg nextLeg = legs.get(i + 1);
        newRoute.setTravelTime(Math.toIntExact(Long.parseLong(nextLeg.duration().replace("s", "")) / 60));
        newRoute.setTravelDistance(nextLeg.distanceMeters());
        newRoute.setPolyline(nextLeg.polyline().encodedPolyline());
        if (newRoute.getTransportMode() == Transport.TRANSIT) {
          String transitInfo = nextLeg.steps().stream()
              .filter(step -> step.transitDetails() != null)
              .map(step -> formatTransitDetails(step.transitDetails()))
              .filter(Objects::nonNull)
              .collect(Collectors.joining(", "));
          newRoute.setTransitDetailInfo(transitInfo);
        }
      } else { // 마지막 장소의 경우 경로 정보가 없으므로 0 또는 빈 문자열로 설정
        newRoute.setTravelTime(0);
        newRoute.setTravelDistance(0);
        newRoute.setPolyline("");
        newRoute.setTransitDetailInfo("");
      }
      newRoutesToSaveList.add(newRoute);
    }
    routeRepository.saveAll(newRoutesToSaveList);

    plan.setEndTime(plan.getEndTime().plusSeconds(totalNewDurationSeconds));
    planRepository.save(plan);
  }

  // Title - 경로 삭제 및 계획 재계산
  public void deleteRouteAndRecalculate(Long planId, Integer routeSequence) {
    Route route = routeRepository.findByPlanIdAndSequence(planId, routeSequence)
        .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
            "Route not found with planId: " + planId + " and sequence: " + routeSequence));
    routeRepository.delete(route);
    Plan plan = planService.findById(planId);
    List<Route> afterDeleRoute = routeRepository.findByPlanIdOrderBySequenceAsc(planId);
    ComputeRoutesRequest computeRequest = new ComputeRoutesRequest(
        afterDeleRoute.stream()
            .map(r -> new PlaceInfo(r.getPlace().getName(), r.getPlace().getPlaceId(),
                r.getTransportMode(), r.getStayTime().intValue(),
                new Location(new Latlng(r.getPlace().getLatitude(), r.getPlace().getLongitude()))))
            .toList(),
        plan.getStartTime(),
        null,
        "METRIC");
    ComputeRoutesResponse response = computeRoutes(computeRequest);
    List<Leg> legs = response.routes().get(0).legs();
    for (int i = 0; i < afterDeleRoute.size(); i++) {
      Route r = afterDeleRoute.get(i);
      r.setSequence(i + 1);
      if (i < legs.size()) {
        Leg leg = legs.get(i);
        r.setTravelTime(Math.toIntExact(Long.parseLong(leg.duration().replace("s", "")) / 60));
        r.setTravelDistance(leg.distanceMeters());
        r.setPolyline(leg.polyline().encodedPolyline());
        if (r.getTransportMode() == Transport.TRANSIT) {
          String transitInfo = leg.steps().stream()
              .filter(step -> step.transitDetails() != null)
              .map(step -> formatTransitDetails(step.transitDetails()))
              .filter(Objects::nonNull)
              .collect(Collectors.joining(", "));
          r.setTransitDetailInfo(transitInfo);
        }
      }
      routeRepository.save(r);
    }
  }

  // Title - route 순서 조정 및 재계산
  @Transactional
  public List<RouteResponseDto> reorderRoutes(Long planId, List<RouteReorderDto> newSequence) {
    List<Route> routes = routeRepository.findByPlanIdOrderBySequenceAsc(planId);
    log.info("routes: {}, newSequence: {}", routes.size(), newSequence.size());
    if (routes.size() != newSequence.size()) {
      throw new IllegalArgumentException("새로운 순서 리스트의 크기는 기존 경로 수와 같아야 합니다.");
    }

    for (RouteReorderDto dto : newSequence) {
      Route route = routes.stream().filter(r -> r.getId().equals(dto.routeId())).findFirst()
          .orElseThrow(() -> new IllegalArgumentException("Route not found with id: " + dto.routeId()));
      route.setSequence(dto.newSequence());
      routeRepository.save(route);
    }

    Plan plan = planService.findById(planId);
    List<Route> reorderedRoutes = routeRepository.findByPlanIdOrderBySequenceAsc(planId);
    ComputeRoutesRequest computeRequest = new ComputeRoutesRequest(
        reorderedRoutes.stream()
            .map(r -> new PlaceInfo(r.getPlace().getName(), r.getPlace().getPlaceId(),
                r.getTransportMode(), r.getStayTime().intValue(),
                new Location(new Latlng(r.getPlace().getLatitude(), r.getPlace().getLongitude()))))
            .toList(),
        plan.getStartTime(),
        null,
        "METRIC");
    ComputeRoutesResponse response = computeRoutes(computeRequest);
    List<Leg> legs = response.routes().get(0).legs();
    for (int i = 0; i < reorderedRoutes.size(); i++) {
      Route r = reorderedRoutes.get(i);
      if (i < legs.size()) {
        Leg leg = legs.get(i);
        r.setTravelTime(Math.toIntExact(Long.parseLong(leg.duration().replace("s", "")) / 60));
        r.setTravelDistance(leg.distanceMeters());
        r.setPolyline(leg.polyline().encodedPolyline());
        if (r.getTransportMode() == Transport.TRANSIT) {
          String transitInfo = leg.steps().stream()
              .filter(step -> step.transitDetails() != null)
              .map(step -> formatTransitDetails(step.transitDetails()))
              .filter(Objects::nonNull)
              .collect(Collectors.joining(", "));
          r.setTransitDetailInfo(transitInfo);
        }
      } else {
        r.setTravelTime(0);
        r.setTravelDistance(0);
        r.setPolyline("");
        r.setTransitDetailInfo("");
      }
      routeRepository.save(r);
    }

    return reorderedRoutes.stream()
        .map(RouteResponseDto::fromEntity)
        .collect(Collectors.toList());
  }
}