package com.preplan.autoplan.domain.disable.KeywordCounter;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@DiscriminatorValue("A")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AgeCounter extends KeywordCounter {

    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup;

    //One인 Area가 주인이 되도록 설정 해야 됨!
    //Counter들은 Many이지만 종이 되어야 함


    @Builder
    public AgeCounter(AgeGroup ageGroup) {
        this.ageGroup = ageGroup;
    }
    //TODO: 키워드 분류는 했는데, member와 연관을 지어줘야 하지 않을까?
    //그건 서비스 계층에서 하면 될듯?


    @Override
    public boolean matchesField(Enum<?> field) {
        return field instanceof AgeGroup && this.ageGroup == field;
    }
}