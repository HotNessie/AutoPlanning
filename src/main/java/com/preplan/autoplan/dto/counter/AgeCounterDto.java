package com.preplan.autoplan.dto.counter;

import com.preplan.autoplan.domain.planArea.KeywordCounter.AgeCounter;
import com.preplan.autoplan.domain.planArea.KeywordCounter.AgeGroup;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AgeCounterDto extends KeywordCounterDto {
    private AgeGroup ageGroup;

    @Builder
    public AgeCounterDto(Long id, int count, AgeGroup ageGroup) {
        super(id, count);
        this.ageGroup = ageGroup;
    }

    public static AgeCounterDto from(AgeCounter ageCounter) {
        return AgeCounterDto.builder()
                .id(ageCounter.getId())
                .count(ageCounter.getCount())
                .ageGroup(ageCounter.getAgeGroup())
                .build();
    }
}