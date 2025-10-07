package com.preplan.autoplan.jwt;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

  private final JwtTokenProvider jwtTokenProvider;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String token = null;
    String authorization = request.getHeader("Authorization");

    if (authorization != null && authorization.startsWith("Bearer ")) {
      token = authorization.substring(7);
    } else if (request.getCookies() != null) {
      // TITLE - 쿠키에서 토큰 추출
      for (Cookie cookie : request.getCookies()) {
        if (cookie.getName().equals("jwt_token")) {
          token = cookie.getValue();
          break;
        }
      }
    }
    if (token == null) {
      filterChain.doFilter(request, response);
      return;
    }
    try {

      String username = jwtTokenProvider.extractUsername(token);
      String role = jwtTokenProvider.extractRole(token);

      Authentication authentication = new UsernamePasswordAuthenticationToken(username, null,
          Collections.singletonList(new SimpleGrantedAuthority(role)));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      // log.info("Jwt token processed successfully for user: {}",
      // SecurityContextHolder.getContext().getAuthentication().getName());

    } catch (Exception e) {
      log.warn("Jwt token processing failed: {}", e.getMessage());
      SecurityContextHolder.clearContext();
    }

    filterChain.doFilter(request, response);
  }
}