package com.preplan.autoplan.service;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberSecurityService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

        List<org.springframework.security.core.GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() -> "ROLE_" + member.getRole().name()); // ROLE_USER, ROLE_ADMIN 등

        return new User(member.getEmail(), member.getPassword(), authorities);
    }
}
