package com.preplan.autoplan.dto.member;

import com.preplan.autoplan.domain.member.Sex;

//회원 정보 수정용
public record MemberUpdateRequestDto(
    String username,
    String email,
    String password,
    Integer birthYear,
    Sex sex
) {

}