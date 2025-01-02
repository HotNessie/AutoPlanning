package com.preplan.autoplan.domain.member;

import com.preplan.autoplan.domain.planArea.Plan;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WishPlan {
    @Id
    @GeneratedValue
    @Column(name = "favorite_id")
    private Long id;

    //    @Column(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    //    @Column(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    //    @Enumerated(EnumType.STRING)
//    private Ddabong favorite;
    @Builder
    public WishPlan(Member member, Plan plan) {
        this.member = member;
        this.plan = plan;
    }
}

