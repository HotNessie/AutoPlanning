package com.preplan.autoplan.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DayOffDto {
    private Long id;
    private Long areaId;
    private LocalDateTime dayOffDate;

}