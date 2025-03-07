package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteService {

    private final GoogleRouteClient googleRouteClient;

    @Value("${google.route.field-mask}")
    private String routeFieldMask;

    @Value("${google.route.region:KR}") // 기본값 KR
    private String region;

    public ComputeRoutesResponse computeRoutes(ComputeRoutesRequest request) {
        validateRoutingPreference(request);
        return googleRouteClient.getRoute(
                routeFieldMask, adaptRequest(request));
    }

    private void validateRoutingPreference(ComputeRoutesRequest request) {
        if ("TRANSIT".equals(request.travelMode()) && request.routingPreference() != null) {
            log.warn("Invalid routing preference for TRANSIT mode: {}",
                    request.routingPreference());
            throw new IllegalArgumentException("TRANSIT 모드에서는 경로 선호도를 설정할 수 없습니다.");
        }
        if ("IMPERIAL".equals(request.units()) && "TRANSIT".equals(request.travelMode().name())) {
            log.warn("Invalid units for TRANSIT mode: {}", request.units());
            throw new IllegalArgumentException("TRANSIT 모드에서는 METRIC 단위만 지원됩니다.");
        }
    }

    private ComputeRoutesRequest adaptRequest(ComputeRoutesRequest original) {
        String routingPreference = original.routingPreference() != null
                ? original.routingPreference()
                : "TRAFFIC_AWARE"; // 기본값 설정
        Transport travelMode = original.travelMode() == Transport.DRIVE && "KR".equals(region)
                ? Transport.TRANSIT
                : original.travelMode();
        return new ComputeRoutesRequest(
                original.origin(),
                original.destination(),
                travelMode,
                original.departureTime(),
                routingPreference,
                original.units());
    }
}