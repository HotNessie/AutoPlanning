package com.preplan.autoplan.controller.route;

import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.domain.planPlace.Route;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import com.preplan.autoplan.dto.route.RouteCreateRequestDto;
import com.preplan.autoplan.dto.route.RouteResponseDto;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@NoArgsConstructor
public class RouteController {

    //routeService생성

    //계획의 경로 및 상세 정보 반환
//    @GetMapping("/plans/{planId}/routes")
//    public ResponseEntity<List<RouteResponseDto>> getRoutesByPlan(@PathVariable Long planId) {
//        List<Route> routes = routeService.findByPlanId(planId);
//        List<RouteResponseDto> dtos = routes.stream()
//            .map(route -> new RouteResponseDto(
//                route.getSequence(),
//                new PlaceResponseDto(
//                    route.getPlace().getId(),
//                    route.getPlace().getPlaceId(),
//                    route.getPlace().getName(),
//                    route.getPlace().getAddress(),
//                    route.getPlace().getLatitude(),
//                    route.getPlace().getLongitude(),
//                    route.getPlace().getSearchCount(),
//                    route.getPlace().getTopPurposeKeywords().stream().map(Enum::name).collect(
//                        Collectors.toList()),
//                    route.getPlace().getTopMoodKeywords().stream().map(Enum::name)
//                        .collect(Collectors.toList()),
//                    route.getPlace().getAverageStayTime()
//                ),
//                route.getTransportMode(),
//                route.getStayTime(),
//                route.getMemo()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

    //경로 추가
//    @PostMapping("/plans/{planId}/routes")
//    public ResponseEntity<RouteResponseDto> addRoute(
//        @PathVariable Long planId,
//        @RequestBody RouteCreateRequestDto dto
//    ) {
//        Plan plan = planService.findById(planId);
//        Place place = placeService.findByPlaceId(dto.placeId());
//
//        Route route = Route.builder()
//            .plan(plan)
//            .place(place)
//            .sequence(dto.sequence())
//            .transportMode(dto.transportMode())
//            .stayTime(dto.stayTime())
//            .memo(dto.memo())
//            .build();
//
//        Route savedRoute = routeService.save(route);
//        place.updateAverageStayTime(dto.stayTime()); // 평균 체류 시간 갱신
//        placeService.save(place);
//
//        RouteResponseDto response = new RouteResponseDto(
//            savedRoute.getSequence(),
//            new PlaceResponseDto(
//                savedRoute.getPlace().getId(),
//                savedRoute.getPlace().getPlaceId(),
//                savedRoute.getPlace().getName(),
//                savedRoute.getPlace().getAddress(),
//                savedRoute.getPlace().getLatitude(),
//                savedRoute.getPlace().getLongitude(),
//                savedRoute.getPlace().getSearchCount(),
//                savedRoute.getPlace().getTopPurposeKeywords().stream().map(Enum::name)
//                    .collect(Collectors.toList()),
//                savedRoute.getPlace().getTopMoodKeywords().stream().map(Enum::name)
//                    .collect(Collectors.toList()),
//                savedRoute.getPlace().getAverageStayTime()
//            ),
//            savedRoute.getTransportMode(),
//            savedRoute.getStayTime(),
//            savedRoute.getMemo()
//        );
//        return ResponseEntity.ok(response);
//    }
}
