package com.preplan.autoplan.domain.planPlace;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private Place place;

    @Column(nullable = false)
    private int sequence;

    private String transportMode;

    @Column(nullable = false)
    private Long stayTime;

    private String memo;

    @Builder
    public Route(Plan plan, Place place, int sequence, String transportMode, Long stayTime,
        String memo) {
        this.plan = plan;
        this.place = place;
        this.sequence = sequence;
        this.transportMode = transportMode;
        this.stayTime = stayTime;
        this.memo = memo;
    }
}

