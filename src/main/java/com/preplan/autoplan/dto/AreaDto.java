package com.preplan.autoplan.dto;

import com.preplan.autoplan.dto.counter.AgeCounterDto;
import com.preplan.autoplan.dto.counter.MoodCounterDto;
import com.preplan.autoplan.dto.counter.PurposeCounterDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AreaDto {
    private Long id;
    private String name;
    private int estimatedTimeRequired;
    private List<DayOffDto> dayOffs;
    private int ddabong;
    private List<MoodCounterDto> moodCounters;
    private List<PurposeCounterDto> purposeCounters;
    private List<AgeCounterDto> ageCounters;

}