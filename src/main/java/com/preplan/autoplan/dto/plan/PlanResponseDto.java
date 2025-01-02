package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import com.preplan.autoplan.dto.PreconditionKeywordDto;
import com.preplan.autoplan.dto.PlanAreaDto;
import com.preplan.autoplan.dto.common.PagedResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PlanResponseDto {
    private Long id;
    private Long memberId;
    private PreconditionKeywordDto preconditionKeyword;
    private Purpose purpose;
    private Mood mood;
    //    private List<PlanAreaDto> planAreas;
    private PlanAreasInfo planAreasInfo;
    //페이지네이션
    //private PagedResponse<PlanAreaDto> planAreas;
    private LocalDateTime createdDate;

    @Getter
    @Setter
    public static class PlanAreasInfo {
        private List<PlanAreaDto> areas;
        private int totalCount;
    }
}