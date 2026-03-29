package com.preplan.autoplan.restController;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.preplan.autoplan.domain.planPlace.Plan;

import com.preplan.autoplan.dto.plan.PlanCreateRequestDto;
import com.preplan.autoplan.dto.plan.PlanKeywordsUpdateRequestDto;
import com.preplan.autoplan.dto.plan.PlanResponseDto;
import com.preplan.autoplan.exception.RouteNotFoundException;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
   * 경로 찾기 - computeRoute(googleApi) !googleApiController같은거 생성할까?
   * 계획 생성 - savePlanString
   * 내 계획 list 조회 - getMyPlans
   * 단일 계획 상세 조회 - getPlanById
   * 모든 계획 조회 (페이징) - getPlans
   * 계획 검색(제목, 지역, 키워드) - searchPlans
   * 계획 설명 수정 - editPlanDescription
   * 키워드 수정 - updatePlanKeywords
   * 제목 수정 - editPlanTitle
   * endTime 수정 - editPlanEndTime
   * 장소id로 관련 계획 조회 - getPlansByPlaceId
   */

  // 경로 요청 selfContent.js submit에서 사용중. 근데 이게 왜 Plan에 있지???? Route만들기 전인가?ㄴ
  @PostMapping("/api/public/route/compute")
  public ResponseEntity<?> computeRoute(
      @Valid @RequestBody ComputeRoutesRequest request) {

    log.info("경로 계산 요청: 출발지={}, 도착지={}, 총 장소 수={}",
        request.placeNames().get(0).placeId(),
        request.placeNames().get(request.placeNames().size() - 1).placeId(),
        request.placeNames().size());
    ComputeRoutesResponse response = routeService.computeRoutes(request);
    if (response.routes().isEmpty()) {
      log.warn("경로가 발견되지 않음");
      throw new RouteNotFoundException("경로를 찾을 수 없습니다.");
    }

    RoutePlanResponseDto planResponseDto = new RoutePlanResponseDto(
        response,
        request.placeNames(),
        request.departureTime());

    log.info("경로 계산 성공: 총 거리 {}m, 소요 시간 {}, 경로= {}",
        response.routes().get(0).distanceMeters(),
        response.routes().get(0).duration(),
        response.routes().get(0).polyline());

    // 응답 반환
    return ResponseEntity.ok(planResponseDto);
  }

  // Title - 경로 응답 DTO
  public record RoutePlanResponseDto(
      @JsonProperty("routeResponse") ComputeRoutesResponse routeResponse,

      @JsonProperty("places") List<ComputeRoutesRequest.PlaceInfo> places,

      @JsonProperty("departureTime") @JsonSerialize(using = ToStringSerializer.class) LocalDateTime departureTime) {
  }

  // Title - 계획 저장 ?이름이 왜 String인거임??
  @PostMapping("/api/private/plans")
  public ResponseEntity<Plan> savePlanString(@Valid @RequestBody PlanCreateRequestDto dto, Authentication authentication) {

    log.info("계획 저장 요청: {}, {}", dto, authentication.getName());
    Long planId = planService.createPlan(dto, authentication.getName());
    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(planId)
        .toUri();
    return ResponseEntity.created(location).build();
  }

  // Title - 내 계획 list 조회
  @GetMapping("/api/private/my-plans")
  public ResponseEntity<Page<PlanResponseDto>> getMyPlans(Authentication authentication, Pageable pageable) {
    String email = authentication.getName();
    Page<Plan> myPlansPage = planService.findByEmail(email, pageable);
    log.info("Found {} plans for email: {}", myPlansPage.getTotalElements(), email);
    Page<PlanResponseDto> responseDtosPage = myPlansPage.map(PlanResponseDto::fromEntity);
    return ResponseEntity.ok(responseDtosPage);
  }

  // Title - 단일 계획 상세 조회
  @GetMapping("/api/public/plan/{planId}")
  public ResponseEntity<PlanResponseDto> getPlanById(@PathVariable Long planId) {
    Plan plan = planService.findById(planId);
    PlanResponseDto responseDto = PlanResponseDto.fromEntity(plan);
    return ResponseEntity.ok(responseDto);

  }

  // Title - 모든 계획 조회 (페이징)
  @GetMapping("/api/public/plans")
  public ResponseEntity<Page<PlanResponseDto>> getPlans(Pageable pageable) {
    Page<Plan> plans = planService.findPlans(pageable);
    Page<PlanResponseDto> responseDtos = plans.map(PlanResponseDto::fromEntity);
    return ResponseEntity.ok(responseDtos);
  }

  // Title - 계획 검색(제목, 지역, 키워드)
  @GetMapping("/api/public/plans/search")
  public ResponseEntity<Page<PlanResponseDto>> searchPlans(
      @RequestParam(required = false) String title,
      @RequestParam(required = false) String region,
      @RequestParam(required = false) String keywords,
      Pageable pageable) {
    log.info("Searching plans with title: {}, region: {}, keywords: {}", title, region, keywords);
    Page<Plan> plans = planService.findPlansCriteria(title, region, keywords, pageable);
    Page<PlanResponseDto> responseDtos = plans.map(PlanResponseDto::fromEntity);
    return ResponseEntity.ok(responseDtos);
  }

  // Title - 계획 설명 수정
  @PatchMapping("/api/private/plan/{planId}/description")
  public ResponseEntity<Void> editPlanDescription(
      @PathVariable Long planId,
      @RequestBody Map<String, String> descriptionRequest) {
    String description = descriptionRequest.get("description");
    log.info("Editing description for planId {}: {}", planId, description);
    planService.editDescription(planId, description);
    return ResponseEntity.noContent().build();
  }

  // Title - 키워드 수정
  @PatchMapping("/api/private/plan/{planId}/keywords")
  public ResponseEntity<Void> updatePlanKeywords(
      @PathVariable Long planId,
      @RequestBody PlanKeywordsUpdateRequestDto requestDto) {
    log.info("Updating keywords for planId {}: {}", planId, requestDto.keywords());
    planService.updateKeywords(planId, requestDto.keywords());
    return ResponseEntity.ok().build();
  }

  // Title - 제목 수정
  @PatchMapping("/api/private/plan/{planId}/title")
  public ResponseEntity<Void> editPlanTitle(
      @PathVariable Long planId,
      @RequestBody Map<String, String> titleRequest) {
    String title = titleRequest.get("title");
    log.info("Editing title for planId {}: {}", planId, title);
    planService.editTitle(planId, title);
    return ResponseEntity.noContent().build();
  }

  // Title - endTime 수정
  @PatchMapping("/api/private/plan/{planId}/endTime")
  public ResponseEntity<Void> editPlanEndTime(
      @PathVariable Long planId,
      @RequestBody Map<String, Long> durationRequest) {
    long duration = durationRequest.get("duration");
    log.info("Editing endTime for planId {}: adding duration {} seconds", planId, duration);
    planService.editEndTime(planId, duration);
    return ResponseEntity.noContent().build();
  }

  /**
   * Title - 장소id로 관련 계획 조회
   */
  @GetMapping("/api/public/plans/by-place/{placeId}")
  public ResponseEntity<List<PlanResponseDto>> getPlansByPlaceId(
      @PathVariable String placeId) {
    log.info("장소Id로 관련 계획 조회 요청: {}", placeId);
    List<PlanResponseDto> plans = planService.getPlansByPlaceId(placeId);
    return ResponseEntity.ok(plans);
  }
  }