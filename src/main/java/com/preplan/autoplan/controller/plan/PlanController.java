package com.preplan.autoplan.controller.plan;

public class PlanController {

    //planService 작성

    //계획 상세정보 반환
//    @GetMapping("/plans/{id}")
//    public ResponseEntity<PlanResponseDto> getPlan(@PathVariable Long id) {
//        Plan plan = planService.findById(id);
//        PlanResponseDto dto = new PlanResponseDto(
//            plan.getId(),
//            new MemberResponseDto(
//                plan.getMember().getId(),
//                plan.getMember().getName(),
//                plan.getMember().getEmail(),
//                plan.getMember().getBirthYear(),
//                plan.getMember().getSex(),
//                plan.getMember().getCreatedDate()
//            ),
//            plan.getRegion(),
//            plan.getStartTime(),
//            plan.getEndTime(),
//            plan.getPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//            plan.getMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//            plan.getRoutes().stream().map(route -> new RouteResponseDto(
//                route.getSequence(),
//                new PlaceResponseDto(
//                    route.getPlace().getId(),
//                    route.getPlace().getPlaceId(),
//                    route.getPlace().getName(),
//                    route.getPlace().getAddress(),
//                    route.getPlace().getLatitude(),
//                    route.getPlace().getLongitude(),
//                    route.getPlace().getSearchCount(),
//                    route.getPlace().getTopPurposeKeywords().stream().map(Enum::name)
//                        .collect(Collectors.toList()),
//                    route.getPlace().getTopMoodKeywords().stream().map(Enum::name)
//                        .collect(Collectors.toList()),
//                    route.getPlace().getAverageStayTime()
//                ),
//                route.getTransportMode(),
//                route.getStayTime(),
//                route.getMemo()
//            )).collect(Collectors.toList()),
//            plan.getLikes(),
//            plan.getBookmarks(),
//            plan.getCreatedAt(),
//            plan.getUpdatedAt()
//        );
//        return ResponseEntity.ok(dto);
//    }

    //공유된 계획 반환용
//    @GetMapping("/members/{memberId}/plans")
//    public ResponseEntity<List<PlanResponseDto>> getPlansByMember(@PathVariable Long memberId) {
//        List<Plan> plans = planService.findByMemberId(memberId);
//        List<PlanResponseDto> dtos = plans.stream()
//            .map(plan -> new PlanResponseDto(
//                plan.getId(),
//                new MemberResponseDto(
//                    plan.getMember().getId(), plan.getMember().getName(),
//                    plan.getMember().getEmail(),
//                    plan.getMember().getBirthYear(), plan.getMember().getSex(),
//                    plan.getMember().getCreatedDate()
//                ),
//                plan.getRegion(),
//                plan.getStartTime(),
//                plan.getEndTime(),
//                plan.getPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//                plan.getMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//                plan.getRoutes().stream().map(route -> new RouteResponseDto(
//                    route.getSequence(),
//                    new PlaceResponseDto(
//                        route.getPlace().getId(), route.getPlace().getPlaceId(),
//                        route.getPlace().getName(),
//                        route.getPlace().getAddress(), route.getPlace().getLatitude(),
//                        route.getPlace().getLongitude(),
//                        route.getPlace().getSearchCount(),
//                        route.getPlace().getTopPurposeKeywords().stream().map(Enum::name)
//                            .collect(Collectors.toList()),
//                        route.getPlace().getTopMoodKeywords().stream().map(Enum::name)
//                            .collect(Collectors.toList()),
//                        route.getPlace().getAverageStayTime()
//                    ),
//                    route.getTransportMode(),
//                    route.getStayTime(),
//                    route.getMemo()
//                )).collect(Collectors.toList()),
//                plan.getLikes(),
//                plan.getBookmarks(),
//                plan.getCreatedAt(),
//                plan.getUpdatedAt()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

    //계획 생성
//    @PostMapping("/plans")
//    public ResponseEntity<PlanResponseDto> createPlan(
//        @RequestBody PlanCreateRequestDto dto,
//        @AuthenticationPrincipal Member currentMember
//    ) {
//        List<PurposeField> purposeKeywords = dto.purposeKeywords().stream()
//            .map(PurposeField::valueOf).collect(Collectors.toList());
//        List<MoodField> moodKeywords = dto.moodKeywords().stream()
//            .map(MoodField::valueOf).collect(Collectors.toList());
//
//        Plan plan = Plan.builder()
//            .member(currentMember)
//            .region(dto.region())
//            .startTime(dto.startTime())
//            .endTime(dto.endTime())
//            .purposeKeywords(purposeKeywords)
//            .moodKeywords(moodKeywords)
//            .build();
//
//        List<Route> routes = dto.routes().stream().map(routeDto -> {
//            Place place = placeService.findByPlaceId(routeDto.placeId());
//            return Route.builder()
//                .plan(plan)
//                .place(place)
//                .sequence(routeDto.sequence())
//                .transportMode(routeDto.transportMode())
//                .stayTime(routeDto.stayTime())
//                .memo(routeDto.memo())
//                .build();
//        }).collect(Collectors.toList());
//
//        plan.getRoutes().addAll(routes);
//        plan.applyKeywordsToPlaces(); // Place에 키워드 반영
//        Plan savedPlan = planService.save(plan);
//
//        PlanResponseDto response = new PlanResponseDto(
//            savedPlan.getId(),
//            new MemberResponseDto(
//                savedPlan.getMember().getId(), savedPlan.getMember().getName(), savedPlan.getMember().getEmail(),
//                savedPlan.getMember().getBirthYear(), savedPlan.getMember().getSex(), savedPlan.getMember().getCreatedDate()
//            ),
//            savedPlan.getRegion(),
//            savedPlan.getStartTime(),
//            savedPlan.getEndTime(),
//            savedPlan.getPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//            savedPlan.getMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//            savedPlan.getRoutes().stream().map(route -> new RouteResponseDto(
//                route.getSequence(),
//                new PlaceResponseDto(
//                    route.getPlace().getId(), route.getPlace().getPlaceId(), route.getPlace().getName(),
//                    route.getPlace().getAddress(), route.getPlace().getLatitude(), route.getPlace().getLongitude(),
//                    route.getPlace().getSearchCount(),
//                    route.getPlace().getTopPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//                    route.getPlace().getTopMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//                    route.getPlace().getAverageStayTime()
//                ),
//                route.getTransportMode(),
//                route.getStayTime(),
//                route.getMemo()
//            )).collect(Collectors.toList()),
//            savedPlan.getLikes(),
//            savedPlan.getBookmarks(),
//            savedPlan.getCreatedAt(),
//            savedPlan.getUpdatedAt()
//        );
//        return ResponseEntity.ok(response);
//    }
}
