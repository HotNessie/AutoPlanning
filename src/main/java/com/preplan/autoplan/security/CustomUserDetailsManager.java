package com.preplan.autoplan.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.member.Role;
import com.preplan.autoplan.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomUserDetailsManager implements UserDetailsManager {

  private final MemberRepository memberRepository;

  /**
   * TITLE - loadUserByUsername
   * 이걸로 가져온 UserDetails의 비밀번호를 PasswordEncoder로 인코딩된 비밀번호와 비교함.
   * AuthenticationManager(실제로는 DaoAuthenticationProvider)가 수행
   * TODO: 인증 성공 후 JWT 토큰 생성. 이후 요청에서는 JwtAuthenticationFilter에서 처리하도록
   */
  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

    return User.builder() // UserDetails의 User임 인증시에만 사용하는 객체
        .username(member.getEmail())
        .password(member.getPassword())
        .authorities(AuthorityUtils.createAuthorityList("ROLE_" + member.getRole().name()))
        .build();
  }

  // TITLE - createUser
  @Override
  public void createUser(UserDetails user) {

    String encodedPassword = new BCryptPasswordEncoder().encode(user.getPassword());

    CustomUserDetails customUser = (CustomUserDetails) user;
    Member member = Member.builder()
        .name(customUser.getUsername()) // 이름은 일단 이메일로
        .email(customUser.getUsername())
        .password(encodedPassword)
        .role(Role.USER) // 역할은 USER로 설정
        .build();
    memberRepository.save(member);
  }

  @Override
  @Transactional
  public void updateUser(UserDetails user) {

    String encodedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
    Member member = memberRepository.findByEmail(user.getUsername())
        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + user.getUsername()));
    Member updatedMember = Member.builder()
        .password(encodedPassword)
        .email(member.getEmail())// ?이메일 나중에 OAUTH 넣으면 어케 되는거지?
        .build();

    memberRepository.save(updatedMember);
  }

  /*
   * TITLE - deleteUser
   * TODO:호출 이후 JWT 만료시키거나. JWT에 만료시간 적용
   */
  @Override
  @Transactional
  public void deleteUser(String email) {

    if (!memberRepository.findByEmail(email).isPresent()) {
      throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email); // 로그인 상태에서 호출하는데 에러 뜰리가 있나
    }
    memberRepository.deleteByEmail(email);
  }

  /*
   * TITLE- 비밀번호 변경
   */
  @Override
  @Transactional
  public void changePassword(String oldPassword, String newPassword) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
      throw new RuntimeException("인증된 사용자가 없습니다.");
    }
    String username = authentication.getName();

    Member member = memberRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));

    if (!new BCryptPasswordEncoder().matches(oldPassword, member.getPassword())) {
      throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
    }

    member.updatePassword(new BCryptPasswordEncoder().encode(newPassword));
    memberRepository.save(member);

  }

  // TITLE - userExists
  @Override
  public boolean userExists(String email) {
    return memberRepository.findByEmail(email).isPresent();
  }

}
