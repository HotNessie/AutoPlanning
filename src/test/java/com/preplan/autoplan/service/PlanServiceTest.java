package com.preplan.autoplan.service;

import com.preplan.autoplan.domain.keyword.Keyword;
import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.member.Role;
import com.preplan.autoplan.domain.member.Sex;
import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.domain.planPlace.Region;
import com.preplan.autoplan.dto.plan.PlanCreateRequestDto;
import com.preplan.autoplan.dto.route.RouteCreateRequestDto;
import com.preplan.autoplan.repository.MemberRepository;
import com.preplan.autoplan.repository.PlaceRepository;
import com.preplan.autoplan.repository.PlanRepository;
import com.preplan.autoplan.repository.RegionRepository;
import com.preplan.autoplan.repository.keyword.KeywordRepository;

import lombok.RequiredArgsConstructor;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@RequiredArgsConstructor
class PlanServiceTest {

  private PlanService planService;
  private PlanRepository planRepository;
  private MemberRepository memberRepository;
  private KeywordRepository keywordRepository;
  private PlaceRepository placeRepository;
  private RegionRepository regionRepository;

  private Member testMember;
  private Place testPlace1;
  private Place testPlace2;
  private Keyword existingKeyword;

  @BeforeEach
  void setUp() {
    // Member
    testMember = Member.builder()
        .email("test@test.com")
        .password("password")
        .name("testUser")
        .birthYear(2000)
        .phoneNumber("01012345678")
        .sex(Sex.MALE)
        .role(Role.USER)
        .build();
    memberRepository.save(testMember);

    // Region & Places
    Region region = Region.builder().name("테스트지역").type("도시").build();
    regionRepository.save(region);

    testPlace1 = Place.builder()
        .placeId("place_1")
        .name("테스트장소1")
        .address("주소1")
        .latitude(37.5)
        .longitude(127.0)
        .region(region)
        .build();
    placeRepository.save(testPlace1);

    testPlace2 = Place.builder()
        .placeId("place_2")
        .name("테스트장소2")
        .address("주소2")
        .latitude(37.6)
        .longitude(127.1)
        .region(region)
        .build();
    placeRepository.save(testPlace2);

    // Pre-existing Keyword
    existingKeyword = keywordRepository.save(new Keyword("기존키워드"));
  }

  @Test
  @DisplayName("새로운 키워드와 기존 키워드를 포함하여 계획을 생성하면, 모든 키워드가 정상적으로 연결된다.")
  void createPlan_withNewAndExistingKeywords_shouldSavePlanWithAllKeywords() {
    // given
    List<String> requestKeywords = List.of("기존키워드", "신규키워드");

    PlanCreateRequestDto dto = new PlanCreateRequestDto(
        "테스트지역",
        "키워드 테스트 계획",
        LocalDateTime.now(),
        null, // endTime은 서비스에서 계산
        List.of(), // purposeKeywords
        List.of(), // moodKeywords
        requestKeywords, // 사용자 정의 키워드
        List.of(
            new RouteCreateRequestDto(testPlace1.getPlaceId(), 1, "WALK", 60L, "메모1", 10, 100, ""),
            new RouteCreateRequestDto(testPlace2.getPlaceId(), 2, "WALK", 60L, "메모2", 10, 100, "")));

    // when
    Long planId = planService.createPlan(dto, testMember.getEmail());

    // then
    // 1. Plan이 정상적으로 저장되었는지 확인
    Plan foundPlan = planRepository.findById(planId)
        .orElseThrow(() -> new AssertionError("Plan이 저장되지 않았습니다."));

    // 2. Plan에 키워드가 2개 연결되었는지 확인
    assertThat(foundPlan.getPlanKeywords()).hasSize(2);

    // 3. 연결된 키워드의 이름이 요청한 키워드와 일치하는지 확인
    Set<String> keywordNamesInPlan = foundPlan.getPlanKeywords().stream()
        .map(planKeyword -> planKeyword.getKeyword().getName())
        .collect(Collectors.toSet());
    assertThat(keywordNamesInPlan).containsExactlyInAnyOrder("기존키워드", "신규키워드");

    // 4. KeywordRepository에 "신규키워드"가 새로 저장되었는지 확인
    Keyword newKeyword = keywordRepository.findByName("신규키워드")
        .orElseThrow(() -> new AssertionError("신규키워드가 Repository에 저장되지 않았습니다."));
    assertThat(newKeyword).isNotNull();

    // 5. 전체 키워드 개수가 2개인지 확인 (기존키워드 1 + 신규키워드 1)
    assertThat(keywordRepository.count()).isEqualTo(2);
  }
}
