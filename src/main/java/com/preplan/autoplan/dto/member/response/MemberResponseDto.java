package com.preplan.autoplan.dto.member.response;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.member.Sex;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberResponseDto {
    private Long id;
    private String name;
    private String email;
    private Integer birthYear;
    private Sex sex;

    @Builder
    public MemberResponseDto(Long id, String name, String email, Integer birthYear, Sex sex) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthYear = birthYear;
        this.sex = sex;
    }

    public static MemberResponseDto fromMemberEntity(Member member) {
        return MemberResponseDto.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .birthYear(member.getBirthYear())
                .sex(member.getSex())
                .build();
    }
}