package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.domain.keyword.PreconditionKeyword;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import com.preplan.autoplan.domain.planArea.PlanArea;
import com.preplan.autoplan.dto.PreconditionKeywordDto;
import com.preplan.autoplan.dto.PlanAreaDto;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlanUpdateDto {
    @NotNull(message = "필수 키워드 입니다.")
    private PreconditionKeyword preconditionKeyword;

    private Purpose purpose;

    private Mood mood;

    @NotNull
    private List<PlanArea> planAreas;

    @Builder
    public PlanUpdateDto(PreconditionKeyword preconditionKeyword,
                         Purpose purpose, Mood mood,
                         List<PlanArea> planAreas) {
        this.preconditionKeyword = preconditionKeyword;
        this.purpose = purpose;
        this.mood = mood;
        this.planAreas = planAreas;
    }
}



