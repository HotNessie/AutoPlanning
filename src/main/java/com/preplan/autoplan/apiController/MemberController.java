package com.preplan.autoplan.apiController;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.dto.member.request.MemberCreateDto;
import com.preplan.autoplan.dto.member.response.MemberSimpleDto;
import com.preplan.autoplan.repository.MemberRepository;
import com.preplan.autoplan.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;

    @PostMapping
    public ResponseEntity<Long> createMember(
            @RequestBody
            @Valid MemberCreateDto memberCreateDto) {
        // 회원 생성 로직=
        Member member = Member.builder()
                .password(memberCreateDto.getPassword())
                .name(memberCreateDto.getName())
                .email(memberCreateDto.getEmail())
                .birthYear(memberCreateDto.getBirthYear())
                .sex(memberCreateDto.getSex())
                .build();
        Long memberId = memberService.createMember(member);
        MemberSimpleDto memberSimpleDto = new MemberSimpleDto(memberId, member.getName());
        return ResponseEntity.ok(memberSimpleDto.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberSimpleDto> getMember(@PathVariable Long id) {
        // 회원 조회 로직
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        MemberSimpleDto memberSimpleDto = new MemberSimpleDto(member.get().getId(), member.get().getName());
        return ResponseEntity.ok(memberSimpleDto);
    }

    // 기타 회원 관련 엔드포인트
}