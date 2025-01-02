package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoodCounterDto {
    private Long id;
    private Long areaId;
    private MoodField moodField;
    private int count;
}