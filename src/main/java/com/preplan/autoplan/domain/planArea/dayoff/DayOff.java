package com.preplan.autoplan.domain.planArea.dayoff;

import com.preplan.autoplan.domain.planArea.Area;
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
    @Id
    @GeneratedValue
    @Column(name = "day_off_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    private LocalDateTime dayOffDate;
    //cron 네이버 api가 지원하는 방법에 따라서 기술 양상이 달라짐.

    @Builder
    public DayOff(Area area, LocalDateTime dayOffDate) {
        this.area = area;
        this.dayOffDate = dayOffDate;
    }
//    @Entity
//    public class Area {
//        @Id
//        private Long id;
//
//        private String name;
//
//        @ManyToOne
//        @JoinColumn(name = "day_off_id")
//        private DayOff dayOff;
//    }
//
//    @Entity
//    public class DayOff {
//        @Id
//        private Long id;
//
//        @OneToMany(mappedBy = "dayOff", cascade = CascadeType.ALL)
//        private List<DayOffDetail> dayOffDetails;
//    }
//
//    @Entity
//    public class DayOffDetail {
//        @Id
//        private Long id;
//
//        private LocalDate date;
//
//        @ManyToOne
//        @JoinColumn(name = "day_off_id")
//        private DayOff dayOff;
//    }

}
