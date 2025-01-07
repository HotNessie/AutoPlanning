package com.preplan.autoplan.service;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public Long createMember(Member member) {
        memberRepository.save(member);
        return member.getId();
    }

//    @Transactional
//    public void updateMember(Long memberId, MemberUpdateDto dto) {
//        Member member = memberRepository.findById(memberId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
//        member.update(dto.getName(), dto.getEmail(), dto.getPassword());
//    }


//    public Optional<Member> findMember(Long memberId) {
//        return memberRepository.findById(memberId);
//    }

}
