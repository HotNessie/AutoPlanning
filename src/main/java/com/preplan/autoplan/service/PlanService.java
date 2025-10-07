package com.preplan.autoplan.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
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
import com.preplan.autoplan.exception.PlaceNotFoundException;
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

  // TITLE - findById
  @Transactional(readOnly = true)
  public Plan findById(Long id) { // Plan 역시 id로 찾으면 안될거같은데?? pk를 search의 기준으로 사용하는게 힘들듯
    return planRepository.findById(id)
        .orElseThrow(() -> new MemberNotFoundException("그런 사람은 없습니다?: " + id));
  }

  // TITLE - findByEmail
  @Transactional(readOnly = true)
  public List<Plan> findByEmail(String email) { // 찾찾 By email
    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new MemberNotFoundException("그런 회원은 없어용~:" + email));
    return planRepository.findByMemberId(member.getId());
  }

  // TITLE - findSharedPlans
  @Transactional(readOnly = true)
  // 걍 다 공유된 계획으로 두는게..?
  public List<Plan> findSharedPlans(Sort sort) { // 니들 계획은 항상 open이야 적어는 두는데 못숨겨
    return planRepository.findByIsSharedTrue(sort);
  }

  // TITLE - savePlan
  @Transactional
  public Plan savePlan(Plan plan) { // 계획을 저장하세용~~ (개인용 bookstand)
    return planRepository.save(plan);
  }

  // ? TODO: Member 구현 후 맴버 추가해야됨
  // TITLE - createPlan
  @Transactional
  public Long createPlan(PlanCreateRequestDto dto, String email) { // 계획 생성
    // public Long createPlan(PlanCreateRequestDto dto) { // 계획 생성
    log.info("createPlan 시작. 요청 데이터: {}", dto);

    Member member = memberRepository.findByEmail(email) // Member
        .orElseThrow(() -> new MemberNotFoundException("그런 회원은 없어용~:" +
            email));

    List<Place> places = dto.routes().stream()
        .map(routeDto -> placeService.findByPlaceIdWithRegion(routeDto.placeId()))
        .collect(Collectors.toList());

    log.info("장소 목록 조회 완료. {}개의 장소를 찾음.", places.size());

    // 대표 지역 설정
    Map<Region, Long> regionCounts = places.stream()
        .map(Place::getRegion)
        .filter(Objects::nonNull)
        .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

    Region representativeRegion = regionCounts.entrySet().stream()
        .max(Map.Entry.comparingByValue())
        .map(Map.Entry::getKey)
        .orElse(places.isEmpty() ? null : places.get(0).getRegion());

    if (representativeRegion == null) {
      log.error("대표 지역을 찾을 수 없습니다. 경로가 비어있을 수 있습니다.");
      throw new IllegalStateException("대표 지역을 찾을 수 없습니다. 경로가 비어있을 수 있습니다.");
    }
    log.info("대표 지역 설정 완료: {}", representativeRegion.getName());

    long totalDuration = dto.routes().stream()
        .mapToLong(
            routeDto -> routeDto.stayTime()
                + (routeDto.travelTime() != null ? routeDto.travelTime()
                    : 0))
        .sum();
    LocalDateTime endTime = dto.startTime().plusMinutes(totalDuration);
    log.info("총 여행 시간 계산 완료. 종료 시간: {}", endTime);

    Plan plan = Plan.builder()
        .member(member)
        .title(dto.title())
        .region(representativeRegion) // 지역 설정
        .startTime(dto.startTime())
        .endTime(endTime)
        .purposeKeywords(dto.purposeKeywords().stream()
            .map(PurposeField::valueOf).collect(Collectors.toList()))
        .moodKeywords(dto.moodKeywords().stream()
            .map(MoodField::valueOf).collect(Collectors.toList()))
        .build();

    log.info("Plan 엔티티 생성 완료. 저장 전: {}", plan);
    Plan savePlan = planRepository.save(plan);
    log.info("Plan 엔티티 저장 완료. 저장 후 ID: {}", savePlan.getId());

    // 경로 생성 및 추가
    List<RouteCreateRequestDto> routeDtos = dto.routes();
    log.info("경로 DTO 목록. {}개의 경로를 처리합니다.", routeDtos.size());
    List<Route> routes = routeDtos.stream().map(routeDto -> {
      log.info("경로 처리 중: placeId={}", routeDto.placeId());
      if (routeDto.placeId() == null) {
        log.error("placeId가 null입니다. 요청 데이터 오류.");
        throw new IllegalArgumentException("요청에 유효하지 않은 placeId가 포함되어 있습니다.");
      }
      Place placeEntity = placeService.findByPlaceId(routeDto.placeId());
      if (placeEntity == null) {
        log.error("ID에 해당하는 장소를 찾을 수 없습니다: {}", routeDto.placeId());
        throw new PlaceNotFoundException("ID에 해당하는 장소를 찾을 수 없습니다: " + routeDto.placeId());
      }

      Route newRoute = Route.builder()
          .plan(savePlan)
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
      log.info("생성된 Route 엔티티: {}", newRoute);
      return newRoute;
    }).collect(Collectors.toList());

    log.info("모든 Route 엔티티 생성 완료. routeRepository.saveAll 호출 전. routes size: {}", routes.size());
    routeRepository.saveAll(routes);
    log.info("routeRepository.saveAll 호출 완료.");

    applyKeywordsAndStayTime(routes, dto.purposeKeywords(), dto.moodKeywords());
    log.info("키워드 및 체류시간 적용 완료.");

    // // 계획에 포함된 장소에 키워드 반영
    // plan.getRoutes().addAll(routes); // 계획에 경로 추가
    // plan.applyKeywordsToPlaces(
    // dto.purposeKeywords().stream().map(PurposeField::valueOf).collect(Collectors.toList()),
    // // dto.purposeKeywords(),
    // dto.moodKeywords().stream().map(MoodField::valueOf).collect(Collectors.toList()));
    // // dto.moodKeywords());

    log.info("createPlan 성공적으로 완료. 반환할 Plan ID: {}", savePlan.getId());
    return savePlan.getId(); // 생성된 계획의 ID 반환
  }

  /**
   * TITLE -키워드 및 체류시간 적용
   */
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

  // TITLE - 좋아요 증가
  @Transactional
  public void likePlan(Long planId) {
    Plan plan = findById(planId);
    plan.increaseLikes();
  }

  // TITLE - 북마크 증가
  @Transactional
  public void bookmarkPlan(Long planId) {
    Plan plan = findById(planId);
    plan.increaseBookmarks();
  }
}