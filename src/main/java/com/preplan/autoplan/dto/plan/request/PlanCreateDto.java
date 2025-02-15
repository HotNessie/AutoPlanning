package com.preplan.autoplan.dto.plan.request;

import com.preplan.autoplan.domain.keyword.PreconditionKeyword;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.planArea.Plan;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;

import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlanCreateDto {

//    @NotNull
//    private Member member;

    @NotNull(message = "사전 조건 키워드는 필수입니다.")
    private PreconditionKeyword preconditionKeyword;

    private Purpose purpose;

    private Mood mood;

    @Builder
    public PlanCreateDto(Member member, PreconditionKeyword preconditionKeyword, Purpose purpose, Mood mood) {
//        this.member = member;
        this.preconditionKeyword = preconditionKeyword;
        this.purpose = purpose;
        this.mood = mood;
    }

    public Plan toEntity() {
        return Plan.builder()
//                .member(member)
                .preconditionKeyword(preconditionKeyword)
                .purpose(purpose)
                .mood(mood)
                .build();
    }
}