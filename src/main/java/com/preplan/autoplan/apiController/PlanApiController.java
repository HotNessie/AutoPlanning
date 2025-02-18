package com.preplan.autoplan.apiController;

import com.preplan.autoplan.googleApi.ComputeRoutesRequest;
import com.preplan.autoplan.googleApi.ComputeRoutesResponse;
import com.preplan.autoplan.googleApi.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PlanApiController {

    private final RouteService routeService;
//    private final GoogleRouteClient googleRouteClient;

    @PostMapping("/route/compute")
    public ResponseEntity<?> computeRoute(
        @Valid @RequestBody ComputeRoutesRequest request
    ) {
        log.info("경로 계산 요청: {} → {}",
            request.origin().location().latLng(),
            request.destination().location().latLng());
        try {
//            String fieldMask = String.join(",",
//                "routes.distanceMeters",
//                "routes.duration", // 소요시간 추가
//                "routes.polyline.encodedPolyline",
//                "routes.legs.distanceMeters", // 각 구간별 거리
//                "routes.legs.duration", // 각 구간별 소요시간
//                "routes.legs.startLocation",
//                "routes.legs.endLocation",
//                "routes.legs.steps.distanceMeters" // 각 단계별 거리
////                "routes.legs.steps.duration" // 각 단계별 소요시간
//            );
            // TRAFFIC_UNAWARE 모드인 경우 departureTime 제거
//            if ("TRAFFIC_UNAWARE".equals(request.routingPreference())) {
//                request = new ComputeRoutesRequest(
//                    request.origin(),
//                    request.destination(),
//                    request.intermediates(),
//                    request.travelMode(),
//                    request.routingPreference(),
//                    request.languageCode(),
//                    null // departureTime 제거
//                );
//            }
            ComputeRoutesResponse response = routeService.computeRoutes(request);
            if (response.routes().isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("경로 계산 실패: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body("서버 오류: " + e.getMessage());
        }
    }
}
