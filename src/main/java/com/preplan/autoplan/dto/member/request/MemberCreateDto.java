package com.preplan.autoplan.dto.member.request;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.member.Sex;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberCreateDto {
    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password;

    @NotNull(message = "출생년도는 필수입니다.")
    @Min(value = 1940, message = "유효한 출생년도를 입력해주세요.")
    private Integer birthYear;

    @NotNull(message = "성별은 필수입니다.")
    private Sex sex;

    @Builder
    public MemberCreateDto(String name, String email, String password,
                           Integer birthYear, Sex sex) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthYear = birthYear;
        this.sex = sex;
    }
    

    public Member toEntity() {
        return Member.builder()
                .name(this.name)
                .email(this.email)
                .password(this.password)
                .birthYear(this.birthYear)
                .sex(this.sex)
                .build();
    }
}