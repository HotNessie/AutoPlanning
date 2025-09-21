package com.preplan.autoplan.security;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/* 
  !이거 말고 CustomUserDetailsManager쓰는걸로. 다른 파일에서 호출 안하는중
  !이거 말고 CustomUserDetailsManager쓰는걸로. 다른 파일에서 호출 안하는중
 * Spring Security에서 사용하는 UserDetailsService 구현체
 * 사용자 인증 정보를 데이터베이스에서 조회
 */
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final MemberRepository memberRepository;

  /*
   * TITLE - 사용자 인증 정보 로드
   */
  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

    return createUserDetails(member);
  }

  /*
   * TITLE - Member 엔티티를 UserDetails로 변환
   * 왜? 그냥 member갖다 쓰면 JWT에 보여주면 안되는 정보들(비밀번호 등)도 같이 들어감
   * DTO같은거임 UserDetails를 타입을 가지는 객체 생성
   */
  private UserDetails createUserDetails(Member member) {
    List<GrantedAuthority> authorities = Collections.singletonList(
        new SimpleGrantedAuthority("ROLE_" + member.getRole().name()));

    // UserDetails 타입을 구현한 User 객체 반환
    // ! 내가 만든 User아님
    return User.builder()
        .username(member.getEmail())
        .password(member.getPassword())
        .authorities(authorities)
        .build();
  }
}
