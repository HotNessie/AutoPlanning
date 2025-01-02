package com.preplan.autoplan.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanAreaDto {
    private Long id;
    private Long planId;
    private Long areaId;
    private int orderNumber;

}