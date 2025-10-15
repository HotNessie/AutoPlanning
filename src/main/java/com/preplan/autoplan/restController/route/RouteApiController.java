package com.preplan.autoplan.restController.route;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.preplan.autoplan.dto.route.RouteResponseDto;
import com.preplan.autoplan.googleApi.RouteService;

@RestController
@RequiredArgsConstructor
public class RouteApiController {

  private final RouteService routeService;

  @GetMapping("/api/private/routes/{planId}")
  public ResponseEntity<List<RouteResponseDto>> getRoutesByPlanId(@PathVariable Long planId) {
    List<RouteResponseDto> routeResponseDtos = routeService.findRouteByPlanId(planId);
    return ResponseEntity.ok(routeResponseDtos);
  }
}
