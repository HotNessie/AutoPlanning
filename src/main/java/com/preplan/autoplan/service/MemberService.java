package com.preplan.autoplan.service;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public Long createMember(Member member) {
        memberRepository.save(member);
        return member.getId();
    }

//    public Optional<Member> findMember(Long memberId) {
//        return memberRepository.findById(memberId);
//    }

}
