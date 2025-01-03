package com.preplan.autoplan.domain.member;

import com.preplan.autoplan.domain.BaseTimeEntity;
import com.preplan.autoplan.domain.planArea.Plan;
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
public class Member extends BaseTimeEntity {
    @Id
    @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private int birthYear;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Sex sex;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    //양방향
    @Column(nullable = false)
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Plan> plan = new ArrayList<>();

    @Builder
    public Member(String password, String name, String email, int birthYear, Sex sex) {
        this.password = password;
        this.name = name;
        this.email = email;
        this.birthYear = birthYear;
        this.sex = sex;
        this.status = Status.ACTIVE;
    }

    //나이를 10년 단위로 종합하기 위한 메소드
    public int getBirthYear(int birthYear) {
        return (birthYear / 10) * 10;
    }

    // 연관관계 편의 메소드 (With_Plan One)
    public void addPlan(Plan plan) {
        this.plan.add(plan);
        plan.assignMember(this);
    }

    public void removePlan(Plan plan) {
        this.plan.remove(plan);
        plan.unassignMember();
    }
}