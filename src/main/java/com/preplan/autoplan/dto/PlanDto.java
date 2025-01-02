package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PlanDto {
    private Long id;
    private Long memberId;
    private PreconditionKeywordDto preconditionKeyword;
    private Purpose purpose;
    private Mood mood;
    private List<PlanAreaDto> planAreas;
    private LocalDateTime createdDate;

}