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

    @PostMapping("/route/compute")
    public ResponseEntity<?> computeRoute(@Valid @ModelAttribute ComputeRoutesRequest request) {
        log.info("경로 계산 요청: 출발지={}, 도착지={}, 총 장소 수={}",
                request.placeNames().get(0).placeId(),
                request.placeNames().get(request.placeNames().size() - 1).placeId(),
                request.placeNames().size());
        try {
            ComputeRoutesResponse response = routeService.computeRoutes(request);
            if (response.routes().isEmpty()) {
                log.warn("경로가 발견되지 않음");
                return ResponseEntity.notFound().build();
            }
            log.info("경로 계산 성공: 총 거리 {}m, 소요 시간 {}",
                    response.routes().get(0).distanceMeters(),
                    response.routes().get(0).duration());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("경로 계산 실패: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
}
