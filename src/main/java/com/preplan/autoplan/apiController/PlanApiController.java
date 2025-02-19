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
    public ResponseEntity<?> computeRoute(
        @Valid @RequestBody ComputeRoutesRequest request
    ) {
        log.info("경로 계산 요청: {} → {}",
            request.origin().location().latLng(),
            request.destination().location().latLng());
        try {
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
