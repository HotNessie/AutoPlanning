package com.preplan.autoplan.dto.counter;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class KeywordCounterDto {
    private Long id;
    private int count;

    protected KeywordCounterDto(Long id, int count) {
        this.id = id;
        this.count = count;
    }
}