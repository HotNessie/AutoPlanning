package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import com.preplan.autoplan.exception.RouteComputationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final GoogleRouteClient googleRouteClient;
//    private final RouteValidationService routeValidationService;

    @Value("${google.route.field-mask}")
    private String routeFieldMask;

    // 경로 계산 with 캐싱
    @Transactional
    @Cacheable(value = "routes", key = "#request.hashCode()")
    @Retryable(retryFor = {Exception.class}, maxAttempts = 2, backoff = @Backoff(delay = 1000))
    public ComputeRoutesResponse computeRoutes(ComputeRoutesRequest request) {
        log.info("Computing routes for request: {}", request);

        // 입력 검증
//        routeValidationService.validateRequest(request);

        List<ComputeRoutesResponse> responses = new ArrayList<>();//답변 리스트
        List<ComputeRoutesRequest.PlaceInfo> places = request.placeNames();//요청 장소 리스트
        LocalDateTime currentDeparture = request.departureTime();//현재 출발 시간

        try {
            for (int i = 0; i < places.size() - 1; i++) {//장소 돌리면서
                ComputeRoutesRequest.PlaceInfo start = places.get(i);
                // 현재 장소의 교통수단이 없으면 기본값으로 TRANSIT 설정
                Transport mode = start.transport() != null ? start.transport() : Transport.TRANSIT;

                ComputeRoutesResponse response = switch (mode) {
                    // 교통수단에 따라 다른 경로 계산
                    // TRANSIT 모드
                    case TRANSIT -> computeTransitRoute(start, places.get(i + 1), currentDeparture, request);
                    // DRIVE 모드
                    case DRIVE -> {
                        int endPoint = findDriveSequenceEnd(places, i);
                        List<ComputeRoutesRequest.PlaceInfo> intermediates = extractIntermediates(
                            places, i, endPoint); //DRIVE가 연속되어있다면 경유지 설정
                        ComputeRoutesResponse driveResponse = computeDriveRoute(start,
                            places.get(endPoint), intermediates,
                            currentDeparture, request);
                        i = endPoint - 1; // 연속된 DRIVE 구간 건너뛰기 ( 다음 i는 다른 transport로 시작 )
                        yield driveResponse;
                    }
                    case WALK -> computeWalkRoute(start, places.get(i + 1), currentDeparture, request);
                };

                responses.add(response);
                currentDeparture = updateDepartureTime(response, currentDeparture, start.time());
            }

            return combineResponses(responses);
        } catch (Exception e) {
            log.error("Error computing routes: ", e);
            throw new RouteComputationException("경로 계산 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 비동기 경로 계산 (대용량 요청용)
    public CompletableFuture<ComputeRoutesResponse> computeRoutesAsync(
        ComputeRoutesRequest request) {
        return CompletableFuture.supplyAsync(() -> computeRoutes(request));
    }

    // // TRANSIT 모드 경로 계산
    private ComputeRoutesResponse computeTransitRoute(
        ComputeRoutesRequest.PlaceInfo origin,
        ComputeRoutesRequest.PlaceInfo destination,
        LocalDateTime departureTime,
        ComputeRoutesRequest request) {

        GoogleRoutesRequest apiRequest = createRequest(origin, destination, null, Transport.TRANSIT,
            departureTime, request);
//        GoogleRoutesRequest apiRequest = createTransitRequest(origin, destination, departureTime, request);
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

    /*// TRANSIT 모드 요청 생성 //존나 헷갈려서 지움 로직도 없는데 이름 갈아끼우기 메소드임
    private GoogleRoutesRequest createTransitRequest(
        ComputeRoutesRequest.PlaceInfo origin,
        ComputeRoutesRequest.PlaceInfo destination,
        LocalDateTime departureTime,
        ComputeRoutesRequest originalRequest) {
        return createRequest(origin, destination, null, Transport.TRANSIT,
            departureTime, originalRequest);
    }*/

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
            .mapToLong(
                response -> Long.parseLong(response.routes().get(0).duration().replace("s", "")))
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
}
