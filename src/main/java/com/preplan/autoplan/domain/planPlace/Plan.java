package com.preplan.autoplan.domain.planPlace;

import com.preplan.autoplan.domain.BaseTimeEntity;
import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.member.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @ElementCollection
    @CollectionTable(name = "plan_purpose_keywords", joinColumns = @JoinColumn(name = "plan_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "purpose_keyword")
    private List<PurposeField> purposeKeywords = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "plan_mood_keywords", joinColumns = @JoinColumn(name = "plan_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "mood_keyword")
    private List<MoodField> moodKeywords = new ArrayList<>();

    @Column(nullable = false)
    private int likes = 0;

    @Column(nullable = false)
    private int bookmarks = 0;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Route> routes = new ArrayList<>();

    @Builder
    public Plan(Member member, String region, LocalDateTime startTime, LocalDateTime endTime,
        List<PurposeField> purposeKeywords, List<MoodField> moodKeywords) {
        this.member = member;
        this.region = region;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purposeKeywords = purposeKeywords != null ? purposeKeywords : new ArrayList<>();
        this.moodKeywords = moodKeywords != null ? moodKeywords : new ArrayList<>();
    }

    // 좋아요 증가
    public void increaseLikes() {
        this.likes++;
    }

    // 북마크 증가
    public void increaseBookmarks() {
        this.bookmarks++;
    }

    // 계획에 포함된 장소에 키워드 반영
    public void applyKeywordsToPlaces() {
        for (Route route : routes) {
            Place place = route.getPlace();
            purposeKeywords.forEach(place::addPurposeKeyword);
            moodKeywords.forEach(place::addMoodKeyword);
        }
    }
}