package com.preplan.autoplan.dto.member;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.member.Sex;
import java.time.LocalDateTime;

//회원 정보 반환
public record MemberResponseDto(
        Long id,
        String username,
        String email,
        Integer birthYear,
        Sex sex,
        LocalDateTime createdDate) {

    public static MemberResponseDto fromEntity(Member member) {
        return new MemberResponseDto(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getBirthYear(),
                member.getSex(),
                member.getCreatedDate());

    }

}
