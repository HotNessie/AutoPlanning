package com.preplan.autoplan.domain.planArea;

import com.preplan.autoplan.domain.planArea.KeywordCounter.KeywordCounter;
import com.preplan.autoplan.exception.InvalidValueException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Area {
    //area긴 한데, 지역은 아니고 건물?가게 에 가까움 어디서 머물지.
    @Id
    @GeneratedValue
    @Column(name = "area_id")
    private Long id;

    @Column(nullable = false)
    private String name; //이거 상수처리 해야되는거 아닌가

    private int estimatedTimeRequired; //예상 소요 시간

    //이건 나중에 확장
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "day_off_id")
//    private DayOff dayOff;

    private int ddabong;

    //양방향
    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, orphanRemoval = true) //고아 엔티티 삭제
    private List<KeywordCounter> keywordCounters = new ArrayList<>();

//    @Column(nullable = false)
//    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL)
//    private List<MoodCounter> moodCounter = new ArrayList<>();
//    @Column(nullable = false)
//    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL)
//    private List<PurposeCounter> purposeCounter = new ArrayList<>();
//    @Column(nullable = false)
//    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL)
//    private List<AgeCounter> ageCounter = new ArrayList<>();

    @Builder
    public Area(String name, int estimatedTimeRequired) {
        this.name = name;
        this.estimatedTimeRequired = estimatedTimeRequired;
    }


    //구현 할 이유가 없는듯. 일단 대기
    //===== 키워드 카운트 증가 메서드 (통합) =====//
    public void incrementKeywordCount(Enum<?> field) throws InvalidValueException {
        KeywordCounter counter = keywordCounters.stream()
                .filter(kc -> kc.matchesField(field))
                .findFirst()
                .orElseThrow(() -> new InvalidValueException("적절한 계수기 없음"));
        counter.increment();
    }

    //연관관계 편의 메소드(with_keywordCounter) One
    public void addKeywordCounter(KeywordCounter kc) {
        this.keywordCounters.add(kc);
        kc.assignArea(this);
    }

    public void removeKeywordCounter(KeywordCounter kc) {
        this.keywordCounters.remove(kc);
        kc.unassignArea();
    }


    //TODO: 식당인지, 식당이라면 한식,일식,중식,양식 등 구분
    //계획 시간에 11~14, 17~21가 존재하면 식당을 하나 넣어줌
    //ageCounter 카운트 메소드 없음
}
