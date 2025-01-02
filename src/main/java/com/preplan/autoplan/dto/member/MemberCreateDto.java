package com.preplan.autoplan.dto.member;

import com.preplan.autoplan.domain.member.Sex;
import lombok.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
public class MemberCreateDto {

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;

    @NotNull(message = "출생년도는 필수입니다.")
    private Integer birthYear;

    @NotNull(message = "성별은 필수입니다.")
    private Sex sex;


}