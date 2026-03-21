package com.preplan.autoplan.restController.route;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.preplan.autoplan.dto.route.RouteReorderDto;
import com.preplan.autoplan.dto.route.RouteResponseDto;
import com.preplan.autoplan.googleApi.ComputeRoutesRequest;
import com.preplan.autoplan.googleApi.RouteService;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RouteApiController {

  private final RouteService routeService;

  /*
   * 계획 하위 경로 조회 - getRotuesByPlanId
   * 체류시간 수정 - editRouteStayTime
   * 메모 수정 - editRouteMemo
   * polyline 수정 - editRoutePolyline
   * travelTime 수정 - editRouteTravelTime
   * travelDistance 수정 - editRouteTravelDistance
   * 기존 계획에 장소 추가 - addPlacesToPlan (PlanApiController)
   * 경로 삭제 - deleteRoute (RouteApiController)
   * 
   */
  // Title - 계획에 포함된 경로 조회
  @GetMapping("/api/public/routes/{planId}")
  public ResponseEntity<List<RouteResponseDto>> getRoutesByPlanId(@PathVariable Long planId) {
    List<RouteResponseDto> routeResponseDtos = routeService.findRouteByPlanId(planId);
    return ResponseEntity.ok(routeResponseDtos);
  }

  // Title - 체류시간 수정
  @PatchMapping("/api/private/route/{planId}&{routeSequence}/stayTime")
  public ResponseEntity<Void> editRouteStayTime(
      @PathVariable Long planId,
      @PathVariable Integer routeSequence,
      @RequestBody Map<String, Long> stayTimeRequest) {
    Long stayTime = stayTimeRequest.get("stayTime");
    log.info("Editing stayTime for routeId {}: {}", routeSequence, stayTime);
    routeService.updateStayTime(planId, routeSequence, stayTime);
    return ResponseEntity.noContent().build();
  }

  // Title - 메모 수정
  @PatchMapping("/api/private/route/{planId}&{routeSequence}/memo")
  public ResponseEntity<Void> editRouteMemo(
      @PathVariable Long planId,
      @PathVariable Integer routeSequence,
      @RequestBody Map<String, String> memoRequest) {
    String memo = memoRequest.get("memo");
    log.info("Editing memo for routeId {}: {}", routeSequence, memo);
    routeService.editMemo(planId, routeSequence, memo);
    return ResponseEntity.noContent().build();
  }

  // Title - polyline 수정
  @PatchMapping("/api/private/route/{planId}&{routeSequence}/polyline")
  public ResponseEntity<Void> editRoutePolyline(
      @PathVariable Long planId,
      @PathVariable Integer routeSequence,
      @RequestBody Map<String, String> polylineRequest) {
    String polyline = polylineRequest.get("polyline");
    log.info("Editing polyline for routeId {}: {}", routeSequence, polyline);
    routeService.editPolyline(planId, routeSequence, polyline);
    return ResponseEntity.noContent().build();
  }

  // Title - travelTime 수정
  @PatchMapping("/api/private/route/{planId}&{routeSequence}/travelTime")
  public ResponseEntity<Void> editRouteTravelTime(
      @PathVariable Long planId,
      @PathVariable Integer routeSequence,
      @RequestBody Map<String, Integer> travelTimeRequest) {
    Integer travelTime = travelTimeRequest.get("travelTime");
    log.info("Editing travelTime for routeId {}: {}", routeSequence, travelTime);
    routeService.editTravelTime(planId, routeSequence, travelTime);
    return ResponseEntity.noContent().build();
  }

  // Title - travelDistance 수정
  @PatchMapping("/api/private/route/{planId}&{routeSequence}/travelDistance")
  public ResponseEntity<Void> editRouteTravelDistance(
      @PathVariable Long planId,
      @PathVariable Integer routeSequence,
      @RequestBody Map<String, Integer> travelDistanceRequest) {
    Integer travelDistance = travelDistanceRequest.get("travelDistance");
    log.info("Editing travelDistance for routeId {}: {}", routeSequence, travelDistance);
    routeService.editTravelDistance(planId, routeSequence, travelDistance);
    return ResponseEntity.noContent().build();
  }

  // Title - 기존 계획에 장소 추가
  @PostMapping("/api/private/plan/{planId}/add-places")
  public ResponseEntity<Void> addPlacesToPlan(
      @PathVariable Long planId,
      @RequestBody ComputeRoutesRequest requestDto) {
    routeService.addPlacesToPlan(planId, requestDto);
    return ResponseEntity.ok().build();
  }

  // Title - 장소 삭제
  @DeleteMapping("/api/private/route/{planId}&{routeSequence}")
  public ResponseEntity<Void> deleteRoute(
      @PathVariable Long planId,
      @PathVariable Integer routeSequence) {
    log.info("Deleting route with planId {} and routeSequence {}", planId, routeSequence);
    routeService.deleteRouteAndRecalculate(planId, routeSequence);
    return ResponseEntity.noContent().build();
  }

  // Title - route 순서 조정
  @PatchMapping("/api/private/plan/{planId}/routes/reorder")
  public ResponseEntity<List<RouteResponseDto>> reorderRoutes(
      @PathVariable Long planId,
      @RequestBody List<RouteReorderDto> newSequence) {
    log.info("Reordering routes for planId {}: {}", planId, newSequence);
    List<RouteResponseDto> updatedRoutes = routeService.reorderRoutes(planId, newSequence);
    return ResponseEntity.ok(updatedRoutes);
  }
}