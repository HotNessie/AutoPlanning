package com.preplan.autoplan.domain.planArea;

import com.preplan.autoplan.domain.planArea.Area.Area;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlanArea {
    @Id
    @GeneratedValue
    @Column(name = "plan_area_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    //양방향
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    private int order;

    //연관관계 편의 메소드 (with_Plan) Many
    public void addPlan(Plan plan) {
        this.plan = plan;
        plan.getPlanArea().add(this);
    }
}
