package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurposeCounterDto {
    private Long id;
    private Long areaId;
    private PurposeField purposeField;
    private int count;

}