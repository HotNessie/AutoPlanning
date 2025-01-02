package com.preplan.autoplan.dto.plan;

import com.preplan.autoplan.domain.keyword.SelectKeyword.Mood;
import com.preplan.autoplan.domain.keyword.SelectKeyword.Purpose;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PlanSimpleDto {
    private Long id;
    private Long memberId;
    private Purpose purpose;
    private Mood mood;
    private LocalDateTime createdDate;

}