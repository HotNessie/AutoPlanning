package com.preplan.autoplan.dto.member;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@Getter
@Setter
public class MemberSimpleDto {
    private Long id;
    private String name;

    public MemberSimpleDto(Long id) {
        this.id = id;
        this.name = "ID: " + id;
    }
}