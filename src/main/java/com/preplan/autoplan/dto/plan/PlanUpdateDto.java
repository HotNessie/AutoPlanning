package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import com.preplan.autoplan.dto.PreconditionKeywordDto;
import com.preplan.autoplan.dto.PlanAreaDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PlanUpdateDto {
    private PreconditionKeywordDto preconditionKeyword;
    private Purpose purpose;
    private Mood mood;
    private List<PlanAreaDto> planAreas;

}