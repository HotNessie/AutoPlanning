package com.preplan.autoplan.apiController;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.googleApi.ComputeRoutesRequest;
import com.preplan.autoplan.googleApi.ComputeRoutesResponse;
import com.preplan.autoplan.googleApi.RouteService;
import com.preplan.autoplan.service.PlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PlanApiController {

    private final RouteService routeService;
    private final PlanService planService;
    // private static

    /*
     * 경로 찾기 - computeRoute
     * 계획 생성 - savePlan
     * 
     */

    // 경로 요청 selfContent submit에서 사용중
    @PostMapping("/route/compute")
    public ResponseEntity<?> computeRoute(
            @Valid @ModelAttribute ComputeRoutesRequest request) {

        log.info("경로 계산 요청: 출발지={}, 도착지={}, 총 장소 수={}",
                request.placeNames().get(0).placeId(),
                request.placeNames().get(request.placeNames().size() - 1).placeId(),
                request.placeNames().size());
        try {
            ComputeRoutesResponse response = routeService.computeRoutes(request);
            if (response.routes().isEmpty()) {
                log.warn("경로가 발견되지 않음");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "경로를 찾을 수 없습니다."));
            }

            RoutePlanResponseDto planResponseDto = new RoutePlanResponseDto(
                    response,
                    request.placeNames(),
                    request.departureTime());

            log.info("경로 계산 성공: 총 거리 {}m, 소요 시간 {}, 경로= {}",
                    response.routes().get(0).distanceMeters(),
                    response.routes().get(0).duration(),
                    response.routes().get(0).polyline());

            // 데이터 저장
            // routeService.saveRoute(request, response);

            // 응답 반환
            // return ResponseEntity.ok(response);
            return ResponseEntity.ok(planResponseDto);

        } catch (Exception e) {
            log.error("경로 계산 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 오류: " + e.getMessage()));
        }
    }

    public record RoutePlanResponseDto(
            @JsonProperty("routeResponse") ComputeRoutesResponse routeResponse,

            @JsonProperty("places") List<ComputeRoutesRequest.PlaceInfo> places,

            @JsonProperty("departureTime") @JsonSerialize(using = ToStringSerializer.class) LocalDateTime departureTime) {
    }

    // @GetMapping("/plan/submit")
    // public String renderPlanFragment() {
    // return "fragments/selfPlanContent";
    // }

    @PostMapping("/create/plan")
    public void savePlanString(@RequestBody Plan entity) {
        log.info("계획 저장 요청: {}", entity);
        planService.savePlan(entity);

    }

}
