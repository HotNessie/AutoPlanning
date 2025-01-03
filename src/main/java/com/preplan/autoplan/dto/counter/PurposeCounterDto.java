package com.preplan.autoplan.dto.counter;

import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.planArea.KeywordCounter.PurposeCounter;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurposeCounterDto extends KeywordCounterDto {
    private PurposeField purposeField;

    @Builder
    public PurposeCounterDto(Long id, int count, PurposeField purposeField) {
        super(id, count);
        this.purposeField = purposeField;
    }

    public static PurposeCounterDto from(PurposeCounter purposeCounter) {
        return PurposeCounterDto.builder()
                .id(purposeCounter.getId())
                .count(purposeCounter.getCount())
                .purposeField(purposeCounter.getPurposeField())
                .build();
    }
}