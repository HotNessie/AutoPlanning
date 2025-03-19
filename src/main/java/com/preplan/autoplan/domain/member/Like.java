package com.preplan.autoplan.domain.member;

import com.preplan.autoplan.domain.planPlace.Plan;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder
    public Like(Member member, Plan plan) {
        this.member = member;
        this.plan = plan;
        this.createdAt = LocalDateTime.now();
    }
}