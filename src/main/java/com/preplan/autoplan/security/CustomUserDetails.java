package com.preplan.autoplan.security;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.preplan.autoplan.domain.member.Member;

import lombok.RequiredArgsConstructor;

/*
 * Spring Security에서 사용하는 UserDetails 구현체
 * Member Entity의 일종 이라고 생각하면 됨.
 */
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

  private final Member member;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Collection<GrantedAuthority> collection = new ArrayList<>();

    collection.add(new GrantedAuthority() {
      @Override
      public String getAuthority() {
        return member.getRole().name(); // ROLE_USER, ROLE_ADMIN
      }

    });
    return collection;
  }

  @Override
  public String getPassword() {
    return member.getPassword();
  }

  // ! Username이지만 email쓰고 이씀.
  @Override
  public String getUsername() {
    return member.getEmail();
  }

  // TITLE - 계정 만료 여부
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  // TITLE - 계정 잠금 여부
  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  // TITLE - 자격 증명 만료 여부
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  // TITLE - 계정 비활성화 여부
  @Override
  public boolean isEnabled() {
    return true;
  }
}
