package com.preplan.autoplan.googleApi;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final GoogleRouteClient googleRouteClient;

    @Value("${google.route.field-mask}")
    private String routeFieldMask;

    public ComputeRoutesResponse computeRoutes(ComputeRoutesRequest request) {
        validateRoutingPreference(request);
        return googleRouteClient.getRoute(
            routeFieldMask, adaptRequest(request)
        );
    }

    private void validateRoutingPreference(ComputeRoutesRequest request) {
        if ("TRANSIT".equals(request.travelMode()) && request.routingPreference() != null) {
            throw new IllegalArgumentException("TRANSIT 모드에서는 라우팅 선호도 설정 불가");
        }

        if ("IMPERIAL".equals(request.units()) && "TRANSIT".equals(request.travelMode())) {
            throw new IllegalArgumentException("TRANSIT 모드에서는 METRIC 단위만 사용 가능");
        }
    }


    private ComputeRoutesRequest adaptRequest(ComputeRoutesRequest original) {

        return new ComputeRoutesRequest(
            original.origin(),
            original.destination(),
            original.intermediates(),
            original.travelMode(),
            original.departureTime(),
            original.routingPreference(),
            original.units()
//            original.routingPreference() != null ? original.routingPreference() : "TRAFFIC_AWARE"
        );
    }
}