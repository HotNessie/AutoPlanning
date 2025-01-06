package com.preplan.autoplan.domain.planArea.Area;

import com.preplan.autoplan.domain.disable.KeywordCounter.KeywordCounter;
import com.preplan.autoplan.domain.member.Status;
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

    private String location;

    private int estimatedTimeRequired; //예상 소요 시간

    private int opening;

    private int closing;

    private int ddabong;

    private Status status;

    @Builder
    public Area(String name, String location, int estimatedTimeRequired, int opening, int closing, Status status) {
        this.name = name;
        this.location = location;
        this.estimatedTimeRequired = estimatedTimeRequired;
        this.opening = opening;
        this.closing = closing;
        this.status = Status.ACTIVE;
    }
    //이건 나중에 확장
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "day_off_id")
//    private DayOff dayOff;

    //계획 시간에 11~14, 17~21가 존재하면 식당을 하나 넣어줌
    //ageCounter 카운트 메소드 없음
}
