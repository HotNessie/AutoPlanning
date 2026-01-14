package com.preplan.autoplan.restController.route;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.preplan.autoplan.dto.route.RouteResponseDto;
import com.preplan.autoplan.googleApi.RouteService;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RouteApiController {

  private final RouteService routeService;

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
}