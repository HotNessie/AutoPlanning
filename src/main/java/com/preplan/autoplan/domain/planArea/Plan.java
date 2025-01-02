package com.preplan.autoplan.domain.planArea;

import com.preplan.autoplan.domain.BaseTimeEntity;
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

    //    @Column(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    //    @Column(nullable = false)
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
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL)
    private List<PlanArea> planArea = new ArrayList<>();

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

    //연관관계 편의 메소드
    public void assignMember(Member member) {
        if (this.member != null) {
            this.member.getPlans().remove(this);
        }
        this.member = member;
        member.getPlans().add(this);
    }

    public void unassignMember() {
        if (this.member != null) {
            this.member.getPlans().remove(this);
            this.member = null;
        }
    }
    //TODO: 따봉 어케하냐
}
