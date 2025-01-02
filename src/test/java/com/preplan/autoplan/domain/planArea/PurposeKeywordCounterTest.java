package com.preplan.autoplan.domain.planArea;

import com.preplan.autoplan.domain.planArea.KeywordCounter.PurposeCounter;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import org.junit.jupiter.api.Test;


import static org.assertj.core.api.Assertions.*;

class PurposeKeywordCounterTest {

    PurposeCounter purposeCounter = new PurposeCounter();

    @Test
    void 계수기_테스트_키워드인식() {
        purposeCounter.setPurposeField(PurposeField.DATE);
        assertThat(purposeCounter.getPurposeField()).isEqualTo(PurposeField.DATE);
    }

    @Test
    void 계수가_카운팅() {
        purposeCounter.setPurposeField(PurposeField.DATE);
        purposeCounter.increment();
        assertThat(purposeCounter.getCount()).isEqualTo(1);
    }
}