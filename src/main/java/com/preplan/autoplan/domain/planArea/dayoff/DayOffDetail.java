package com.preplan.autoplan.domain.planArea.dayoff;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DayOffDetail {
    @Id
    @GeneratedValue
    @Column(name = "day_off_detail_id")
    private Long id;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "day_off_id")
    private DayOff dayOff;
}
