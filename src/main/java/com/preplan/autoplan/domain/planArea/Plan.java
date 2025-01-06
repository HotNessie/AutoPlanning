package com.preplan.autoplan.domain.planArea;

import com.preplan.autoplan.domain.BaseTimeEntity;
import com.preplan.autoplan.domain.global.Location;
import com.preplan.autoplan.domain.keyword.PreconditionKeyword;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import com.preplan.autoplan.domain.member.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Plan extends BaseTimeEntity {
    @Id
    @GeneratedValue
    @Column(name = "plan_id")
    private Long id;

    //양방향
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    //양방향
    @Column(nullable = false)
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL)
    private List<PlanArea> planArea = new ArrayList<>();

    @Embedded
    private Location location;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "precondition_keyword_id")
    private PreconditionKeyword preconditionKeyword;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "purpose_id")
    private Purpose purpose;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mood_id")
    private Mood mood;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdDate;

    @Builder
    public Plan(Member member, PreconditionKeyword preconditionKeyword, Purpose purpose, Mood mood) {
        this.member = member;
        this.preconditionKeyword = preconditionKeyword;
        this.purpose = purpose;
        this.mood = mood;
        this.createdDate = LocalDateTime.now();
    }

    //연관관계 편의 메소드 (with_Member Many)
    public void assignMember(Member member) {
        if (this.member != null) {
            this.member.getPlan().remove(this);
        }
        this.member = member;
        member.getPlan().add(this);
    }

    public void unassignMember() {
        if (this.member != null) {
            this.member.getPlan().remove(this);
            this.member = null;
        }
    }

    //연관관계 편의 메소드 (with_PlanArea One)
    public void addPlanArea(PlanArea area) {
        this.planArea.add(area);
        area.assignPlan(this);
    }

    public void removePlanArea(PlanArea area) {
        this.planArea.remove(area);
        area.unassignPlan();
    }
    //TODO: 따봉 어케하냐
}
