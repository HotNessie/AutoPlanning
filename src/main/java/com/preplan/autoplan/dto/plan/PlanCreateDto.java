package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import com.preplan.autoplan.dto.PreconditionKeywordDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
public class PlanCreateDto {
    @NotNull(message = "회원 ID는 필수입니다.")
    private Long memberId;

    @NotNull(message = "사전 조건 키워드는 필수입니다.")
    private PreconditionKeywordDto preconditionKeyword;

    @NotNull(message = "목적은 필수입니다.")
    private Purpose purpose;

    @NotNull(message = "분위기는 필수입니다.")
    private Mood mood;

}