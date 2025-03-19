package com.preplan.autoplan.domain.member;

import com.preplan.autoplan.domain.BaseTimeEntity;
import com.preplan.autoplan.domain.planPlace.Plan;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호 (서비스 레이어에서 처리)

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private int birthYear;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Sex sex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // 양방향 관계
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Plan> plans = new ArrayList<>();

    @Builder
    public Member(String password, String name, String email, int birthYear, Sex sex) {
        this.password = password;
        this.name = name;
        this.email = email;
        this.birthYear = birthYear;
        this.sex = sex;
        this.status = Status.ACTIVE;
    }

    // 나이대를 10년 단위로 계산하는 메서드
    public int getAgeGroup() {
        int currentYear = LocalDateTime.now().getYear();
        int age = currentYear - this.birthYear;
        return (age / 10) * 10;
    }
}