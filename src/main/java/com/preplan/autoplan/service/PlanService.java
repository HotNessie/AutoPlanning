package com.preplan.autoplan.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.domain.planPlace.Region;
import com.preplan.autoplan.domain.planPlace.Route;
import com.preplan.autoplan.dto.plan.PlanCreateRequestDto;
import com.preplan.autoplan.dto.route.RouteCreateRequestDto;
import com.preplan.autoplan.exception.MemberNotFoundException;
import com.preplan.autoplan.repository.MemberRepository;
import com.preplan.autoplan.repository.PlanRepository;
import com.preplan.autoplan.repository.RouteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlanService {

    private final PlanRepository planRepository;
    private final PlaceService placeService;
    private final MemberRepository memberRepository;
    private final RouteRepository routeRepository;

    @Transactional(readOnly = true)
    public Plan findById(Long id) { // Plan 역시 id로 찾으면 안될거같은데?? pk를 search의 기준으로 사용하는게 힘들듯
        return planRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("그런 사람은 없습니다?: " + id));
    }

    @Transactional(readOnly = true)
    public List<Plan> findByMemberId(Long memberId) { // 찾찾 By memberId
        return planRepository.findByMemberId(memberId);
    }

    @Transactional(readOnly = true)
    // 걍 다 공유된 계획으로 두는게..?
    public List<Plan> findSharedPlans(Sort sort) { // 니들 계획은 항상 open이야 적어는 두는데 못숨겨
        return planRepository.findByIsSharedTrue(sort);
    }

    @Transactional
    public Plan savePlan(Plan plan) { // 계획을 저장하세용~~ (개인용 bookstand)
        return planRepository.save(plan);
    }

    // TODO: Member 구현 후 맴버 추가해야됨
    @Transactional
    // public Plan createPlan(PlanCreateRequestDto dto, Member memberDto) { // 계획 생성
    public Long createPlan(PlanCreateRequestDto dto) { // 계획 생성
        // Member member = memberRepository.findByName(memberDto.getName()) // Member
        // .orElseThrow(() -> new MemberNotFoundException("그런 회원은 없어용~:" +
        // memberDto.getName()));

        List<Place> places = dto.routes().stream()
                .map(routeDto -> placeService.findByPlaceIdWithRegion(routeDto.placeId()))
                .collect(Collectors.toList());

        // 대표 지역 설정
        Map<Region, Long> regionCounts = places.stream()
                .map(Place::getRegion)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        Region representativeRegion = regionCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(places.isEmpty() ? null : places.get(0).getRegion());
        // .orElseGet(() -> routes.isEmpty() ? null :
        // routes.get(0).getPlace().getRegion());

        if (representativeRegion == null) {
            throw new IllegalStateException("대표 지역을 찾을 수 없습니다. 경로가 비어있을 수 있습니다.");
        }

        long totalDuration = dto.routes().stream()
                .mapToLong(
                        routeDto -> routeDto.stayTime() + (routeDto.travelTime() != null ? routeDto.travelTime() : 0))
                .sum();
        LocalDateTime endTime = dto.startTime().plusMinutes(totalDuration);

        Plan plan = Plan.builder()
                // .member(member)
                .region(representativeRegion) // 지역 설정
                .startTime(dto.startTime())
                .endTime(endTime)
                .purposeKeywords(dto.purposeKeywords().stream()
                        .map(PurposeField::valueOf).collect(Collectors.toList()))
                .moodKeywords(dto.moodKeywords().stream()
                        .map(MoodField::valueOf).collect(Collectors.toList()))
                .build();
        Plan savePlan = planRepository.save(plan);

        // 경로 생성 및 추가
        List<RouteCreateRequestDto> routeDtos = dto.routes();
        List<Route> routes = routeDtos.stream().map(routeDto -> {
            Place placeEntity = placeService.findByPlaceId(routeDto.placeId());
            return Route.builder()
                    .plan(plan)
                    .place(placeEntity)
                    .sequence(routeDto.sequence())
                    .transportMode(routeDto.transportMode())
                    .stayTime(routeDto.stayTime())
                    .memo(routeDto.memo())
                    .travelTime(routeDto.travelTime())
                    .travelDistance(routeDto.travelDistance())
                    .build();

            // 체류시간 업데이트
            // placeEntity.updateAverageStayTime(routeDto.stayTime());
            // return route;
        }).collect(Collectors.toList());
        routeRepository.saveAll(routes);

        applyKeywordsAndStayTime(routes, dto.purposeKeywords(), dto.moodKeywords());

        // // 계획에 포함된 장소에 키워드 반영
        // plan.getRoutes().addAll(routes); // 계획에 경로 추가
        // plan.applyKeywordsToPlaces(
        // dto.purposeKeywords().stream().map(PurposeField::valueOf).collect(Collectors.toList()),
        // // dto.purposeKeywords(),
        // dto.moodKeywords().stream().map(MoodField::valueOf).collect(Collectors.toList()));
        // // dto.moodKeywords());

        return savePlan.getId(); // 생성된 계획의 ID 반환
    }

    private void applyKeywordsAndStayTime(List<Route> routes, List<String> purposeKeywords,
            List<String> moodKeywords) {
        List<PurposeField> purposeFields = purposeKeywords.stream()
                .map(PurposeField::valueOf)
                .collect(Collectors.toList());
        List<MoodField> moodFields = moodKeywords.stream()
                .map(MoodField::valueOf)
                .collect(Collectors.toList());
        for (Route route : routes) {
            Place place = route.getPlace();
            purposeFields.forEach(place::addPurposeKeyword);
            moodFields.forEach(place::addMoodKeyword);
            place.updateAverageStayTime(route.getStayTime());
        }
    }

    // 좋아요 증가
    @Transactional
    public void likePlan(Long planId) {
        Plan plan = findById(planId);
        plan.increaseLikes();
    }

    // 북마크 증가
    @Transactional
    public void bookmarkPlan(Long planId) {
        Plan plan = findById(planId);
        plan.increaseBookmarks();
    }
}