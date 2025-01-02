package com.preplan.autoplan.domain.member;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MemberCreateDtoTest {
    public int getBirthYear(int birthYear) {
        int a = birthYear / 10;
        int i = a * 10;
        return i;
    }

    @Test
    void 출생년도_계산() {
        //given
        int birthYear = 1999;
        int birthYear1 = getBirthYear(birthYear);
        assertThat(birthYear1).isEqualTo(1990);
    }

}