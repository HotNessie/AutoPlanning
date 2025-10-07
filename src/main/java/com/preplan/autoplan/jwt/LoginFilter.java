package com.preplan.autoplan.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.preplan.autoplan.dto.member.LoginRequestDto;
import com.preplan.autoplan.security.CustomUserDetails;

/*
 * JWT 인증을 처리하는 필터 / 기존 UsernamePasswordAuthenticationFilter를 확장, 대체
 * 사용자가 로그인 시도 시, 이 필터가 동작하여 인증을 처리
 */
@RequiredArgsConstructor
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  // TITLE - 인증 시도
  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
      throws AuthenticationException {

    String username;
    String password;

    if (request.getContentType().contains("application/json")) {
      try {
        ObjectMapper objectMapper = new ObjectMapper();
        LoginRequestDto loginRequest = objectMapper.readValue(request.getInputStream(), LoginRequestDto.class);
        username = loginRequest.email();
        password = loginRequest.password();
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
    } else {
      username = obtainUsername(request);
      password = obtainPassword(request);
    }

    log.info("Attempting authentication for user: {}", request.getParameter("email"));
    log.info("Attempting authentication for user: {}", username);

    // String username = obtainUsername(request);
    // String password = obtainPassword(request);

    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password,
        null);
    return authenticationManager.authenticate(authToken);
  }

  // TITLE - 인증 성공 시
  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain, Authentication authResult) throws IOException {

    CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
    String username = userDetails.getUsername();

    Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
    Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
    GrantedAuthority authority = iterator.next();

    String role = authority.getAuthority();

    String token = jwtTokenProvider.generateToken(username, role);
    // response.addHeader("Authorization", "Bearer " + token);
    Cookie cookie = new Cookie("jwt_token", token);
    cookie.setMaxAge(60 * 60 * 24); // 1 day
    cookie.setHttpOnly(true);
    cookie.setPath("/"); // 모든 경로에서 접근 가능
    response.addCookie(cookie);
    response.sendRedirect("/plan");
  }

  // TITLE - 인증 실패 시
  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException failed) {

    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
  }
}
