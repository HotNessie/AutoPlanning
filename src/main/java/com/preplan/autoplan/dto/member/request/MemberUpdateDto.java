package com.preplan.autoplan.dto.member.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberUpdateDto {
    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password;

    @Builder
    public MemberUpdateDto(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

//이거 데이터를 여기서 넘길지 서비스나 엔티티에서 받아서 변환, 저장 동시에 할지 생각해보셈
}
