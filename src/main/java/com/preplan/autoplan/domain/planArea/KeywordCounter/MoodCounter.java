package com.preplan.autoplan.domain.planArea.KeywordCounter;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@DiscriminatorValue("M")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MoodCounter extends KeywordCounter {

    @Enumerated(EnumType.STRING)
    private MoodField moodField;
    //One인 Area가 주인이 되도록 설정 해야 됨!
    //Counter들은 Many이지만 종이 되어야 함

    //아무리 봐도 many인 쪽에서 area를 설정해야 하는게 맞는데,
    //상속관계라 이를 해결해야 함
    @Builder
    public MoodCounter(MoodField moodField) {
        this.moodField = moodField;
    }

    @Override
    public boolean matchesField(Enum<?> field) {
        return field instanceof MoodField && this.moodField == field;
    }
}
