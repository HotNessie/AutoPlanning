package com.preplan.autoplan.service;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원가입
     */
    @Transactional
    public Long join(Member member) {
        validateDuplicateMember(member); // 중복 회원 검증
        member.updatePassword(passwordEncoder.encode(member.getPassword())); // 비밀번호 암호화
        memberRepository.save(member);
        return member.getId();
    }

    private void validateDuplicateMember(Member member) {
        Optional<Member> findMembers = memberRepository.findByEmail(member.getEmail());
        if (findMembers.isPresent()) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }
    }

    /**
     * 이메일로 회원 조회
     */
    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 회원을 찾을 수 없습니다."));
    }
}
