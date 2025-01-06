package com.preplan.autoplan.domain.disable.KeywordCounter;

import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@DiscriminatorValue("P")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurposeCounter extends KeywordCounter {

    @Enumerated(EnumType.STRING)
    private PurposeField purposeField;

    //One인 Area가 주인이 되도록 설정 해야 됨!
    //Counter들은 Many이지만 종이 되어야 함

    @Builder
    public PurposeCounter(PurposeField purposeField) {
        this.purposeField = purposeField;
    }

    @Override
    public boolean matchesField(Enum<?> field) {
        return field instanceof PurposeField && this.purposeField == field;

    }
}
