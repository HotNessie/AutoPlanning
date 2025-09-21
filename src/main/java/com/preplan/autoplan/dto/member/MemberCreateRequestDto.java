package com.preplan.autoplan.dto.member;

import com.preplan.autoplan.domain.member.Role;
import com.preplan.autoplan.domain.member.Sex;

//회원 가입용
public record MemberCreateRequestDto(
    String password,
    String username,
    String email,
    Integer birthYear,
    Sex sex,
    Role role) {

}
