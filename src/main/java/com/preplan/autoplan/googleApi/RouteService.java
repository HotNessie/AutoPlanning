package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import com.preplan.autoplan.googleApi.ComputeRoutesResponse.Route.Polyline;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final GoogleRouteClient googleRouteClient;

    @Value("${google.route.field-mask}")
    private String routeFieldMask;

    public ComputeRoutesResponse computeRoutes(ComputeRoutesRequest request) {
        List<ComputeRoutesResponse> responses = new ArrayList<>(); // 받은 응답
        List<ComputeRoutesRequest.PlaceInfo> places = request.placeNames(); // 요청 리스트
        LocalDateTime currentDeparture = request.departureTime(); // 출발시간

        // 리스트 확인
        for (int i = 0; i < places.size() - 1; i++) {
            ComputeRoutesRequest.PlaceInfo start = places.get(i);
            Transport mode = start.transport() != null ? start.transport() : Transport.TRANSIT; // 출발 위치의 교통 수단

            if (mode == Transport.TRANSIT) {
                // TRANSIT: 개별 구간 요청
                GoogleRoutesRequest apiRequest = createSingleRequest(start, places.get(i + 1), mode, currentDeparture,
                        request); // 요청 생성
                ComputeRoutesResponse response = googleRouteClient.getRoute(routeFieldMask, apiRequest);
                responses.add(response);// 결과 받아서 저장

                // 다음 출발 시간 계산
                long travelDurationSeconds = Long.parseLong(response.routes().get(0).duration().replace("s", ""));
                currentDeparture = currentDeparture.plusSeconds(travelDurationSeconds)
                        .plusMinutes(start.time() != null ? start.time() : 0);
            } else if (mode == Transport.DRIVE) {
                // DRIVE: 연속 구간 묶기
                int j = i;
                List<ComputeRoutesRequest.PlaceInfo> intermediates = new ArrayList<>();
                while (j < places.size() - 1 && places.get(j).transport() == Transport.DRIVE) {
                    if (j > i)
                        intermediates.add(places.get(j)); // DRIVE의 경우 경유지에 추가
                    j++;
                }
                GoogleRoutesRequest apiRequest = createDriveRequest(start, places.get(j), intermediates, mode,
                        currentDeparture, request); // 경유지 옵션을 추가해서 요청
                ComputeRoutesResponse response = googleRouteClient.getRoute(routeFieldMask, apiRequest);
                responses.add(response);// 받은 응답에 추가

                // 다음 출발 시간 계산
                long travelDurationSeconds = Long.parseLong(response.routes().get(0).duration().replace("s", ""));
                currentDeparture = currentDeparture.plusSeconds(travelDurationSeconds)
                        .plusMinutes(start.time() != null ? start.time() : 0);
                i = j - 1;
            }
        }

        return combineResponses(responses); // 모드별 경로 합산
    }

    private GoogleRoutesRequest createSingleRequest(
            ComputeRoutesRequest.PlaceInfo origin,
            ComputeRoutesRequest.PlaceInfo destination,
            Transport travelMode,
            LocalDateTime departureTime,
            ComputeRoutesRequest originalRequest) {
        return new GoogleRoutesRequest(
                toPlace(origin),
                toPlace(destination),
                null, // TRANSIT는 경유지 미지원
                travelMode.name(),
                departureTime.atZone(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT),
                originalRequest.routingPreference(),
                originalRequest.units());
    }

    private GoogleRoutesRequest createDriveRequest(
            ComputeRoutesRequest.PlaceInfo origin,
            ComputeRoutesRequest.PlaceInfo destination,
            List<ComputeRoutesRequest.PlaceInfo> intermediates,
            Transport travelMode,
            LocalDateTime departureTime,
            ComputeRoutesRequest originalRequest) {
        List<GoogleRoutesRequest.Place> intermediatePlaces = intermediates.stream()
                .map(this::toPlace)
                .toList();
        return new GoogleRoutesRequest(
                toPlace(origin),
                toPlace(destination),
                intermediatePlaces,
                travelMode.name(),
                departureTime.atZone(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT),
                originalRequest.routingPreference(),
                originalRequest.units());
    }

    private GoogleRoutesRequest.Place toPlace(ComputeRoutesRequest.PlaceInfo info) {
        return new GoogleRoutesRequest.Place(
                info.placeId(),
                info.location() != null ? new GoogleRoutesRequest.Place.Location(
                        new GoogleRoutesRequest.Place.Location.LatLng(
                                info.location().latLng().latitude(),
                                info.location().latLng().longitude()))
                        : null);
    }

    private ComputeRoutesResponse combineResponses(List<ComputeRoutesResponse> responses) {
        int totalDistance = 0;
        long totalDuration = 0;
        StringBuilder polyline = new StringBuilder();
        List<ComputeRoutesResponse.Route.Leg> combinedLegs = new ArrayList<>();

        for (ComputeRoutesResponse response : responses) {
            ComputeRoutesResponse.Route route = response.routes().get(0);
            totalDistance += route.distanceMeters();
            totalDuration += Long.parseLong(route.duration().replace("s", ""));
            polyline.append(route.polyline().encodedPolyline());
            combinedLegs.addAll(route.legs() != null ? route.legs() : List.of());
        }

        ComputeRoutesResponse.Route combinedRoute = new ComputeRoutesResponse.Route(
                totalDistance,
                totalDuration + "s",
                new Polyline(polyline.toString()),
                combinedLegs);

        return new ComputeRoutesResponse(List.of(combinedRoute));
    }
}