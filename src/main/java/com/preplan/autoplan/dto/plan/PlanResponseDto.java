package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.domain.keyword.PreconditionKeyword;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.planArea.Plan;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlanResponseDto {

    private Long planId;

    private Member member;

    private PreconditionKeyword preconditionKeyword;

    private Purpose purpose;

    private Mood mood;

    private LocalDateTime createdDate;
    //    private List<PlanAreaDto> planAreas;

    //페이지네이션
    //private PagedResponse<PlanAreaDto> planAreas;
    @Builder
    public PlanResponseDto(Long planId, Member member, PreconditionKeyword preconditionKeyword, Purpose purpose, Mood mood, LocalDateTime createdDate) {
        this.planId = planId;
        this.member = member;
        this.preconditionKeyword = preconditionKeyword;
        this.purpose = purpose;
        this.mood = mood;
        this.createdDate = createdDate;
    }

    public static PlanResponseDto from(Plan plan) {
        return PlanResponseDto.builder()
                .planId(plan.getId())
                .member(plan.getMember())
                .preconditionKeyword(plan.getPreconditionKeyword())
                .purpose(plan.getPurpose())
                .mood(plan.getMood())
                .createdDate(plan.getCreatedDate())
                .build();
    }

}