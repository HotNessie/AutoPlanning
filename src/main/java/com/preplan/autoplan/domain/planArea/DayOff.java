package com.preplan.autoplan.domain.planArea;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DayOff {
    //공유될 수 있는 휴무일
    @Id
    @GeneratedValue
    @Column(name = "day_off_id")
    private Long id;

    private LocalDateTime dayOffDate;
    //cron 네이버 api가 지원하는 방법에 따라서 기술 양상이 달라짐.

    @Builder
    public DayOff(Area area, LocalDateTime dayOffDate) {
        this.dayOffDate = dayOffDate;
    }
}
