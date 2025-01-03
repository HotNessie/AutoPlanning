package com.preplan.autoplan.dto.counter;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.planArea.KeywordCounter.MoodCounter;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MoodCounterDto extends KeywordCounterDto {
    private MoodField moodField;

    @Builder
    public MoodCounterDto(Long id, int count, MoodField moodField) {
        super(id, count);
        this.moodField = moodField;
    }

    public static MoodCounterDto from(MoodCounter moodCounter) {
        return MoodCounterDto.builder()
                .id(moodCounter.getId())
                .count(moodCounter.getCount())
                .moodField(moodCounter.getMoodField())
                .build();
    }
}