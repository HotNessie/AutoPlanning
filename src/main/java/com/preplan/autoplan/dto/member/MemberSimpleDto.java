package com.preplan.autoplan.dto.member;

import com.preplan.autoplan.domain.member.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@Getter
@NoArgsConstructor
public class MemberSimpleDto {
    private Long id;
    private String name;

    @Builder
    public MemberSimpleDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    //확인
    public static MemberSimpleDto fromMemberEntity(Member member) {
        return MemberSimpleDto.builder()
                .id(member.getId())
                .name(member.getName())
                .build();
    }
}