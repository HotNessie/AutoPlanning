package com.preplan.autoplan.domain.planPlace;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlaceKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private Place place;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose_keyword")
    private PurposeField purposeKeyword;

    @Enumerated(EnumType.STRING)
    @Column(name = "mood_keyword")
    private MoodField moodKeyword;

    @Column(nullable = false)
    private int count = 1;

    @Builder
    public PlaceKeyword(Place place, PurposeField purposeKeyword, MoodField moodKeyword) {
        this.place = place;
        this.purposeKeyword = purposeKeyword;
        this.moodKeyword = moodKeyword;
    }

    // 빈도 증가
    public void increaseCount() {
        this.count++;
    }

    // Getter (하나만 반환되도록 설계)
    public PurposeField getPurposeKeyword() {
        return purposeKeyword;
    }

    public MoodField getMoodKeyword() {
        return moodKeyword;
    }
}