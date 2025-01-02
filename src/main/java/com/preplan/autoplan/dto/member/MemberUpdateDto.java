package com.preplan.autoplan.dto.member;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.Email;

@Getter
@Setter
public class MemberUpdateDto {
    private String name;

    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    private String password;

}