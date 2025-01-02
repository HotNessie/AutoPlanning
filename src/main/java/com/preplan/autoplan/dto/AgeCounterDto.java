package com.preplan.autoplan.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgeCounterDto {
    private Long id;
    private Long areaId;
    private int ageGroup;
    private int count;

}