package com.preplan.autoplan.domain.planPlace;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String placeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private int searchCount = 0;

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
    public Place(String placeId, String name, String address, Double latitude, Double longitude) {
        this.placeId = placeId;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
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
}