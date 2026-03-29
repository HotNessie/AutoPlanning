package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.member.Role;
import com.preplan.autoplan.domain.member.Sex;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record MemberFormDto(
    @NotBlank(message = "이름은 필수 입력 값입니다.")
    String name,

    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email(message = "이메일 형식으로 입력해주세요.")
    String email,

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Size(min = 8, max = 16, message = "비밀번호는 8자 이상, 16자 이하로 입력해주세요.")
    String password,

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    String phoneNumber,

    @NotNull(message = "출생 연도는 필수 입력 값입니다.")
    Integer birthYear, // record에서는 null 체크를 위해 Integer 권장

    @NotNull(message = "성별을 선택해주세요.")
    Sex sex,

    Role role // 기본값은 서비스 로직에서 처리
) {
    // 기본 생성자 (Thymeleaf 폼 바인딩을 위해 필요한 경우)
    public MemberFormDto() {
        this(null, null, null, null, null, null, null);
    }
}
