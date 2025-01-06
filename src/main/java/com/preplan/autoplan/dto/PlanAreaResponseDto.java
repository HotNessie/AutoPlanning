package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.planArea.PlanArea;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlanAreaResponseDto {
    private Long id;
    private Long planId;
    private Long areaId;
//    private int orderNumber;

    @Builder
    public PlanAreaResponseDto(Long id, Long planId, Long areaId) {
        this.id = id;
        this.planId = planId;
        this.areaId = areaId;
    }

    public static PlanAreaResponseDto from(PlanArea planArea) {
        return PlanAreaResponseDto.builder()
                .id(planArea.getId())
                .planId(planArea.getPlan().getId())
                .areaId(planArea.getArea().getId())
                .build();
    }
}