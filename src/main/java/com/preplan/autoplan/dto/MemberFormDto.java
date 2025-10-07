package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.member.Role;
import com.preplan.autoplan.domain.member.Sex;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberFormDto { // 이새끼는 왜 record 안했었지???

    @NotBlank(message = "이름은 필수 입력 값입니다.")
    private String name;

    @NotEmpty(message = "이메일은 필수 입력 값입니다.")
    @Email(message = "이메일 형식으로 입력해주세요.")
    private String email;

    @NotEmpty(message = "비밀번호는 필수 입력 값입니다.")
    @Size(min = 8, max = 16, message = "비밀번호는 8자 이상, 16자 이하로 입력해주세요.")
    private String password;

    @NotEmpty(message = "전화번호는 필수 입력 값입니다.")
    private String phoneNumber;

    private int birthYear;

    private Sex sex;

    private Role role; // 기본값은 USER로 설정될 예정
}
