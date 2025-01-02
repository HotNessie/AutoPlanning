package com.preplan.autoplan.dto.member;

import com.preplan.autoplan.domain.member.Sex;
import com.preplan.autoplan.domain.member.Status;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MemberResponseDto {
    private Long id;
    private String name;
    private String email;
    private int birthYear;
    private Sex sex;
//    private Status status;
//    private LocalDateTime createdDate;

}