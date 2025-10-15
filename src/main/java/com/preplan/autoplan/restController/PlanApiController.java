package com.preplan.autoplan.restController;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.dto.plan.PlanCreateRequestDto;
import com.preplan.autoplan.dto.plan.PlanResponseDto;
import com.preplan.autoplan.googleApi.ComputeRoutesRequest;
import com.preplan.autoplan.googleApi.ComputeRoutesResponse;
import com.preplan.autoplan.googleApi.RouteService;
import com.preplan.autoplan.service.PlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PlanApiController {

  private final RouteService routeService;
  private final PlanService planService;

  /*
   * 경로 찾기 - computeRoute
   * 계획 생성 - savePlanString
   * 내 계획 list 조회 - getMyPlans
   * 
   */

  // 경로 요청 selfContent.js submit에서 사용중. 근데 이게 왜 Plan에 있지???? Route만들기 전인가?ㄴ
  @PostMapping("/api/public/route/compute")
  public ResponseEntity<?> computeRoute(
      @Valid @RequestBody ComputeRoutesRequest request) {

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

      // 데이터 저장. --을 나중에 계획 저장 이후에 해야되겠죠ㅕㅇ?
      // Aug 7, 2025 at 07:16 이걸 왜 나중에 하기로 했지?(route에 회원 정보가 필요한가? 왜? 왜그랬지?)
      // routeService.saveRoute(request, response);

      // 응답 반환
      return ResponseEntity.ok(planResponseDto);

    } catch (Exception e) {
      log.error("경로 계산 실패: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "서버 오류: " + e.getMessage()));
    }
  }

  // Title - 경로 응답 DTO
  public record RoutePlanResponseDto(
      @JsonProperty("routeResponse") ComputeRoutesResponse routeResponse,

      @JsonProperty("places") List<ComputeRoutesRequest.PlaceInfo> places,

      @JsonProperty("departureTime") @JsonSerialize(using = ToStringSerializer.class) LocalDateTime departureTime) {
  }

  // Title - 계획 저장
  // TODO: 사용자 인증 정보에서 member뽑아 오는게 맞지 않을까?
  @PostMapping("/api/private/plans")
  public ResponseEntity<Plan> savePlanString(@RequestBody PlanCreateRequestDto dto, Authentication authentication) {

    log.info("계획 저장 요청: {}, {}", dto, authentication.getName());
    Long planId = planService.createPlan(dto, authentication.getName());
    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(planId)
        .toUri();
    return ResponseEntity.created(location).build();
  }

  // Title - 내 계획 list 조회
  // TODO: Member 구현 후 마무리
  @GetMapping("/api/private/my-plans")
  public ResponseEntity<List<PlanResponseDto>> getMyPlans(Authentication authentication) {
    String email = authentication.getName();
    List<Plan> myPlans = planService.findByEmail(email);
    log.info("Found {} plans for email: {}", myPlans.size(), email);
    List<PlanResponseDto> responseDtos = myPlans.stream()
        .map(PlanResponseDto::fromEntity)
        .toList();
    // 여기서 plan관련 모든 정보를 불러왔어야 했나
    return ResponseEntity.ok(responseDtos);
  }

  /*
   * //반환 테스트용
   * public record GetPlansSimple(Long id, String title) {
   * public static GetPlansSimple fromEntity(Plan plan) {
   * return new GetPlansSimple(plan.getId(), plan.getTitle());
   * }
   * }
   */

  // Title - 단일 계획 상세 조회
  @GetMapping("/api/private/plan/{planId}")
  public ResponseEntity<PlanResponseDto> getPlanById(@PathVariable Long planId) {
    Plan plan = planService.findById(planId);
    PlanResponseDto responseDto = PlanResponseDto.fromEntity(plan);
    return ResponseEntity.ok(responseDto);

  }

}