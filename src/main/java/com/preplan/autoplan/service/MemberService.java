package com.preplan.autoplan.service;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.member.Role;
import com.preplan.autoplan.dto.MemberFormDto;
import com.preplan.autoplan.repository.MemberRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    /**
     * TODO: crud같은 기능은 UserDetailsMa2ager에서 처리,
     * 여기서는 인증과 무관한 사용자 프로필 업데이트같은 비지니스 로직 처리
     * TITLE - 회원가입
     */
    @Transactional
    public Long join(MemberFormDto memberFormDto) {
        Member member = Member.builder()
                .name(memberFormDto.getName())
                .email(memberFormDto.getEmail())
                .password(new BCryptPasswordEncoder().encode(memberFormDto.getPassword())) // 서비스 계층에서 비밀번호 암호화
                .birthYear(memberFormDto.getBirthYear())
                .phoneNumber(memberFormDto.getPhoneNumber())
                .sex(memberFormDto.getSex())
                .role(Role.USER)
                .build();

        validateDuplicateMember(member); // 중복 회원 검증
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
