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

//    public void updateMember(Member member) {
//        member.updateName(this.name);
//        member.updateEmail(this.email);
//        if (this.password != null && !this.password.isEmpty()) {
//            member.updatePassword(this.password);
//        }
//}
}
