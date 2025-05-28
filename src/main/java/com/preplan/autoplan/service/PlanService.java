package com.preplan.autoplan.service;

import java.util.List;
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
import com.preplan.autoplan.exception.MemberNotFoundException;
import com.preplan.autoplan.exception.PlaceNotFoundException;
import com.preplan.autoplan.repository.MemberRepository;
import com.preplan.autoplan.repository.PlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PlanService {

  private final PlanRepository planRepository;
  private final PlaceService placeService;
  private final MemberRepository memberRepository;
  private final RegionService regionService;

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

  @Transactional
  public Plan createPlan(PlanCreateRequestDto dto, Member memberDto) { // 계획 생성
    Member member = memberRepository.findByName(memberDto.getName()) // Member Entity로 쓰고 있음 DTO로 바꿔라
        .orElseThrow(() -> new MemberNotFoundException("그런 회원은 없어용~:" + memberDto.getName()));

    // 계획 생성
    // Region region = regionService.findOrCreateRegion(dto.regionName(),
    // dto.regionType());
    Region region = regionService.findOrCreateRegion(dto.regionName(), "CITY"); // 지역 생성
    Plan plan = Plan.builder()
        .member(member)
        .region(region)
        .startTime(dto.startTime())
        .endTime(dto.endTime())
        .purposeKeywords(dto.purposeKeywords().stream()
            .map(PurposeField::valueOf).collect(Collectors.toList()))
        .moodKeywords(dto.moodKeywords().stream()
            .map(MoodField::valueOf).collect(Collectors.toList()))
        .build();

    // 경로 생성 및 추가
    List<Route> routes = dto.routes().stream().map(routeDto -> {
      Place place = placeService.findByPlaceId(routeDto.placeId());
      if (place == null) {
        throw new PlaceNotFoundException("그런 장소는 없어용~" + routeDto.placeId());
      }
      Route route = Route.builder()
          .plan(plan)
          .place(place)
          .sequence(routeDto.sequence())
          .transportMode(routeDto.transportMode())
          .stayTime(routeDto.stayTime())
          .memo(routeDto.memo())
          .build();

      // 체류시간 업데이트
      place.updateAverageStayTime(routeDto.stayTime());
      return route;
    }).collect(Collectors.toList());

    // 계획에 포함된 장소에 키워드 반영
    plan.getRoutes().addAll(routes); // 계획에 경로 추가
    plan.applyKeywordsToPlaces(
        dto.purposeKeywords().stream().map(PurposeField::valueOf).collect(Collectors.toList()),
        // dto.purposeKeywords(),
        dto.moodKeywords().stream().map(MoodField::valueOf).collect(Collectors.toList()));
    // dto.moodKeywords());

    return savePlan(plan);
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