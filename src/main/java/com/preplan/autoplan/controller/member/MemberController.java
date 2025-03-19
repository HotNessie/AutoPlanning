package com.preplan.autoplan.apiController.member;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.dto.member.MemberCreateRequestDto;
import com.preplan.autoplan.dto.member.MemberResponseDto;
import com.preplan.autoplan.dto.member.MemberUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController {

    //memberService 만들고

    //회원 조회
//    @GetMapping("/members/{id}")
//    public ResponseEntity<MemberResponseDto> getMember(@PathVariable Long id) {
//        Member member = memberService.findById(id);
//        MemberResponseDto dto = new MemberResponseDto(
//            member.getId(),
//            member.getName(),
//            member.getEmail(),
//            member.getBirthYear(),
//            member.getSex(),
//            member.getCreatedDate()
//        );
//        return ResponseEntity.ok(dto);
//    }

    //회원 가입 - 등록
//    @PostMapping("/members")
//    public ResponseEntity<MemberResponseDto> createMember(@RequestBody MemberCreateRequestDto dto) {
//        Member member = Member.builder()
//            .password(passwordEncoder.encode(dto.password())) // 비밀번호 암호화
//            .name(dto.username())
//            .email(dto.email())
//            .birthYear(dto.birthYear())
//            .sex(dto.sex())
//            .build();
//        Member savedMember = memberService.save(member);
//        MemberResponseDto response = new MemberResponseDto(
//            savedMember.getId(), savedMember.getName(), savedMember.getEmail(),
//            savedMember.getBirthYear(), savedMember.getSex(), savedMember.getCreatedDate()
//        );
//        return ResponseEntity.ok(response);
//    }

    //회원 정보 수정
//    @PatchMapping("/members/{id}")
//    public ResponseEntity<MemberResponseDto> updateMember(@PathVariable Long id, @RequestBody MemberUpdateRequestDto dto) {
//        Member member = memberService.findById(id);
//        if (dto.username() != null) member.setName(dto.username());
//        if (dto.email() != null) member.setEmail(dto.email());
//        if (dto.password() != null) member.setPassword(passwordEncoder.encode(dto.password()));
//        if (dto.birthYear() != null) member.setBirthYear(dto.birthYear());
//        if (dto.sex() != null) member.setSex(dto.sex());
//        Member updatedMember = memberService.save(member);
//        MemberResponseDto response = new MemberResponseDto(
//            updatedMember.getId(), updatedMember.getName(), updatedMember.getEmail(),
//            updatedMember.getBirthYear(), updatedMember.getSex(), updatedMember.getCreatedDate()
//        );
//        return ResponseEntity.ok(response);
//    }
}
