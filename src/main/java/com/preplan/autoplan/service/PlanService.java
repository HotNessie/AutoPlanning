package com.preplan.autoplan.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.preplan.autoplan.domain.keyword.Keyword;
import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.domain.planPlace.Region;
import com.preplan.autoplan.domain.planPlace.Route;
import com.preplan.autoplan.dto.plan.PlanCreateRequestDto;
import com.preplan.autoplan.dto.plan.PlanRequestDto;
import com.preplan.autoplan.dto.plan.PlanResponseDto;
import com.preplan.autoplan.dto.route.RouteCreateRequestDto;
import com.preplan.autoplan.exception.MemberNotFoundException;
import com.preplan.autoplan.exception.PlaceNotFoundException;
import com.preplan.autoplan.repository.MemberRepository;
import com.preplan.autoplan.repository.PlanRepository;
import com.preplan.autoplan.repository.RouteRepository;
import com.preplan.autoplan.repository.keyword.KeywordRepository;
import com.preplan.autoplan.googleApi.RouteService;
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
  private final KeywordRepository keywordRepository;

  // TITLE - findById
  @Transactional(readOnly = true)
  public Plan findById(Long id) {
    return planRepository.findById(id)
        .orElseThrow(() -> new MemberNotFoundException("그런 사람은 없습니다?: " + id));
  }

  // TITLE - findByEmail
  @Transactional(readOnly = true)
  public Page<Plan> findByEmail(String email, Pageable pageable) { // 찾찾 By email
    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new MemberNotFoundException("그런 회원은 없어용~:" + email));
    return planRepository.findByMemberId(member.getId(), pageable);
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

  // TITLE - createPlan
  @Transactional
  public Long createPlan(PlanCreateRequestDto dto, String email) { // 계획 생성
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

    // --- startTime이 null이면 현재 시간으로 설정 ---
    LocalDateTime startTime = (dto.startTime() != null) ? dto.startTime() : LocalDateTime.now();

    long totalDuration = dto.routes().stream()
        .mapToLong(
            routeDto -> routeDto.stayTime()
                + (routeDto.travelTime() != null ? routeDto.travelTime()
                    : 0))
        .sum();
    LocalDateTime endTime = startTime.plusMinutes(totalDuration); // 이제 안전하게 startTime 사용

    Plan plan = Plan.builder()
        .member(member)
        .title(
            dto.title() == null || dto.title().isBlank() ? "Plan_" + startTime.toLocalDate().toString() : dto.title())
        .region(representativeRegion) // 지역 설정
        .startTime(startTime) // 수정된 startTime 사용
        .endTime(endTime) // 계산된 endTime 사용
        .description(dto.description())
        .build();

    if (dto.keywords() != null && !dto.keywords().isEmpty()) {
      processAndAddKeywords(plan, dto.keywords());
    }

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
          .polyline(routeDto.polyline() != null ? routeDto.polyline() : "")
          .transitDetailInfo(routeDto.transitDetailInfo()) // transitDetailInfo 추가
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

    // applyKeywordsAndStayTime(routes, dto.purposeKeywords(), dto.moodKeywords());
    applyKeywordsAndStayTime(routes);
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
   * TITLE - 사용자 정의 키워드 처리 및 Plan에 추가
   */
  private void processAndAddKeywords(Plan plan, List<String> keywordNames) {
    log.info("사용자 정의 키워드 처리. 키워드: {}", keywordNames);
    for (String name : keywordNames) {
      Keyword keyword = keywordRepository.findByName(name)
          .orElseGet(() -> {
            log.info("새로운 키워드", name);
            return keywordRepository.save(new Keyword(name));
          });
      plan.addKeyword(keyword);
    }
    log.info("사용자 정의 키워드 처리 완료.");
  }

  /**
   * TITLE -키워드 및 체류시간 적용
   */
  // private void applyKeywordsAndStayTime(List<Route> routes, List<String>
  // purposeKeywords, List<String> moodKeywords) {
  private void applyKeywordsAndStayTime(List<Route> routes) {
    // List<PurposeField> purposeFields = purposeKeywords.stream()
    // .map(PurposeField::valueOf)
    // .collect(Collectors.toList());
    // List<MoodField> moodFields = moodKeywords.stream()
    // .map(MoodField::valueOf)
    // .collect(Collectors.toList());
    for (Route route : routes) {
      Place place = route.getPlace();
      // purposeFields.forEach(place::addPurposeKeyword);
      // moodFields.forEach(place::addMoodKeyword);
      place.updateAverageStayTime(route.getStayTime());
    }
  }

  // TITLE - 좋아요 증가
  @Transactional
  public void likePlan(Long planId) {
    Plan plan = findById(planId);
    plan.increaseLikes();
  }

  // TITLE - 최신 계획 조회
  @Transactional(readOnly = true)
  public Page<Plan> findPlans(Pageable pageable) {
    return planRepository.findAll(pageable);
  }

  // Title - 복합 검색
  @Transactional(readOnly = true)
  public Page<Plan> findPlansCriteria(String searchTitle, String searchRegion, String searchKeywords,
      Pageable pageable) {

    List<String> userKeywords = null;
    if (searchKeywords != null && !searchKeywords.isEmpty()) {
      // 쉼표로 구분된 문자열을 공백 제거 후 리스트로 변환
      userKeywords = List.of(searchKeywords.split(",")).stream()
          .map(String::trim)
          .collect(Collectors.toList());
    }

    PlanRequestDto requestDto = new PlanRequestDto(searchTitle, null, searchRegion, userKeywords, null, null);

    return planRepository.findByCriteria(requestDto, pageable);
  }

  // Title - 설명 수정
  @Transactional
  public Plan editDescription(Long planId, String description) {
    Plan plan = findById(planId);
    if (plan.getDescription().equals(description)) {
      log.info("설명이 변경되지 않았습니다. planId: {}", planId);
      return plan;
    }
    plan.setDescription(description);
    return planRepository.save(plan);
  }

  // TITLE - 키워드 수정
  @Transactional
  public void updateKeywords(Long planId, List<String> newKeywordNames) {
    // 1. Plan Entity 조회
    Plan plan = planRepository.findById(planId)
        .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Plan not found with id: " + planId));

    // 2. 기존 키워드 연결 모두 제거 (orphanRemoval=true 때문에 DB에서도 삭제됨)
    plan.getPlanKeywords().clear();

    // 3. 새로운 키워드 목록 처리
    if (newKeywordNames != null && !newKeywordNames.isEmpty()) {
      for (String name : newKeywordNames) {
        // 4. DB에 키워드가 없으면 새로 생성, 있으면 조회
        Keyword keyword = keywordRepository.findByName(name)
            .orElseGet(() -> keywordRepository.save(new Keyword(name)));

        // 5. Plan에 새로운 키워드 연결 추가
        plan.addKeyword(keyword); // Plan Entity의 addKeyword 헬퍼 메소드 사용
      }
    }
  }

  // Title - 제목 수정
  @Transactional
  public void editTitle(Long planId, String title) {
    Plan plan = findById(planId);
    if (plan.getTitle().equals(title)) {
      log.info("제목이 변경되지 않았습니다. planId: {}", planId);
      return;
    }
    plan.setTitle(title);
    planRepository.save(plan);
  }

  // Title - endTime 수정
  @Transactional
  public void editEndTime(Long planId, long durationInSeconds) {
    Plan plan = findById(planId);
    LocalDateTime newEndTime = plan.getEndTime().plusSeconds(durationInSeconds);
    if (plan.getEndTime().equals(newEndTime)) {
      log.info("endTime이 변경되지 않았습니다. planId: {}", planId);
      return;
    }
    plan.setEndTime(newEndTime);
    planRepository.save(plan);
  }

  public List<PlanResponseDto> getPlansByPlaceId(String placeId) {
    // DB의 PK(Long)가 아닌 Google의 placeId(String)를 기준으로 조회
    List<Plan> plans = planRepository.findAllByPlaceId(placeId);

    if (plans.isEmpty()) {
      log.warn("해당 장소Id로 관련된 계획이 없습니다: {}", placeId);
      return List.of();
    }

    return plans.stream()
        .map(PlanResponseDto::fromEntity)
        .collect(Collectors.toList());
  }

}