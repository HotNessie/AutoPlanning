package com.preplan.autoplan.domain.planPlace;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import jakarta.persistence.*;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Place {

    // Place는 여행지 정보를 담고 있는 엔티티로, 장소의 ID, 이름, 주소, 좌표, 검색 횟수 등을 포함합니다.

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String placeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private int searchCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlaceKeyword> purposeKeywords = new ArrayList<>();

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlaceKeyword> moodKeywords = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "place_top_purpose_keywords", joinColumns = @JoinColumn(name = "place_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "top_purpose_keyword")
    private List<PurposeField> topPurposeKeywords = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "place_top_mood_keywords", joinColumns = @JoinColumn(name = "place_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "top_mood_keyword")
    private List<MoodField> topMoodKeywords = new ArrayList<>();

    @Column(nullable = false)
    private Long averageStayTime = 0L;

    @Builder
    public Place(String placeId, String name, String address, Double latitude, Double longitude, Region region) {
        this.placeId = placeId;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.region = region; // 지역은 나중에 설정
    }

    // 검색 횟수 증가
    public void increaseSearchCount() {
        this.searchCount++;
    }

    // 목적 키워드 추가
    public void addPurposeKeyword(PurposeField keyword) {
        PlaceKeyword existing = purposeKeywords.stream()
                .filter(pk -> pk.getPurposeKeyword() == keyword)
                .findFirst().orElse(null);
        if (existing != null) {
            existing.increaseCount();
        } else {
            PlaceKeyword newKeyword = PlaceKeyword.builder()
                    .place(this)
                    .purposeKeyword(keyword)
                    .build();
            this.purposeKeywords.add(newKeyword);
        }
        updateTopPurposeKeywords();
    }

    // 분위기 키워드 추가
    public void addMoodKeyword(MoodField keyword) {
        PlaceKeyword existing = moodKeywords.stream()
                .filter(pk -> pk.getMoodKeyword() == keyword)
                .findFirst().orElse(null);
        if (existing != null) {
            existing.increaseCount();
        } else {
            PlaceKeyword newKeyword = PlaceKeyword.builder()
                    .place(this)
                    .moodKeyword(keyword)
                    .build();
            this.moodKeywords.add(newKeyword);
        }
        updateTopMoodKeywords();
    }

    // 상위 3개 목적 키워드 갱신
    // TODO: 장소 등록 초기에 너무 많이 업데이트 될 수 있으니, 이 부분은 나중에 최적화 필요
    private void updateTopPurposeKeywords() {
        this.topPurposeKeywords = purposeKeywords.stream()
                .sorted((a, b) -> Integer.compare(b.getCount(), a.getCount()))
                .map(PlaceKeyword::getPurposeKeyword)
                .limit(3)
                .collect(Collectors.toList());
    }

    // 상위 3개 분위기 키워드 갱신
    private void updateTopMoodKeywords() {
        this.topMoodKeywords = moodKeywords.stream()
                .sorted((a, b) -> Integer.compare(b.getCount(), a.getCount()))
                .map(PlaceKeyword::getMoodKeyword)
                .limit(3)
                .collect(Collectors.toList());
    }

    // 평균 체류 시간 업데이트
    public void updateAverageStayTime(Long newStayTime) {
        this.averageStayTime = (this.averageStayTime + newStayTime) / 2;
    }

    public static Place toEntity(PlaceResponseDto placeResponseDto) {
        return Place.builder()
                .placeId(placeResponseDto.placeId())
                .name(placeResponseDto.name())
                .address(placeResponseDto.address())
                .latitude(placeResponseDto.latitude())
                .longitude(placeResponseDto.longitude())
                .build();
    }
}