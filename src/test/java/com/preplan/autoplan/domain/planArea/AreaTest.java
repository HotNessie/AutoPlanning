package com.preplan.autoplan.domain.planArea;

import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.disable.KeywordCounter.PurposeCounter;
import com.preplan.autoplan.domain.planArea.Area.Area;
import com.preplan.autoplan.exception.InvalidValueException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.*;

class AreaTest {
    Area area = new Area();
    PurposeCounter purposeCounter = new PurposeCounter();

    @Test
    void 키워드_증가_메소드() throws IOException {
        //given
        purposeCounter.setPurposeField(PurposeField.DATE);
        area.getPurposeCounter().add(purposeCounter);
        //when
        area.incrementPurposeCount(PurposeField.DATE);
        //then
        assertThat(purposeCounter.getCount()).isEqualTo(1);
    }

    @Test
    void 키워드_증가_메소드_실패() throws InvalidValueException {
        //given
        purposeCounter.setPurposeField(PurposeField.DATE);
        area.getPurposeCounter().add(purposeCounter);
        //when
        //then
        Assertions.assertThrows(InvalidValueException.class,
                () -> area.incrementPurposeCount(PurposeField.ADVENTURE));
        //
    }

}