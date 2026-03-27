package com.preplan.autoplan.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.preplan.autoplan.domain.token.RefreshToken;
import com.preplan.autoplan.dto.member.LoginRequestDto;
import com.preplan.autoplan.repository.token.RefreshTokenRepository;
import com.preplan.autoplan.security.jwt.JwtTokenProvider;
import com.preplan.autoplan.security.service.CustomUserDetailsService.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;
  private final RefreshTokenRepository refreshTokenRepository;

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
      throws AuthenticationException {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      LoginRequestDto loginRequest = objectMapper.readValue(request.getInputStream(), LoginRequestDto.class);

      UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
          loginRequest.email(), loginRequest.password(), null);
      // 권한은 인증 성공 후에 설정

      return authenticationManager.authenticate(authToken);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
      Authentication authResult) throws IOException {
    CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
    String email = userDetails.getUsername();
    String role = userDetails.getAuthorities().iterator().next().getAuthority();

    // 토큰 생성
    String accessToken = jwtTokenProvider.generateAccessToken(email, role);
    String refreshToken = jwtTokenProvider.generateRefreshToken(email);

    // Refresh Token DB 저장 (RTR 적용을 위해 기존 토큰 갱신 또는 신규 저장)
    saveRefreshToken(userDetails, refreshToken);

    // 응답 설정
    response.addCookie(createCookie("refresh_token", refreshToken));
    response.setHeader("Authorization", "Bearer " + accessToken);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write("{\"message\": \"Login Success\", \"token\": \"" + accessToken + "\"}");

    log.info("Authentication successful for user: {}", email);
  }

  private void saveRefreshToken(CustomUserDetails userDetails, String refreshToken) {
      LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshTokenExpirationTime());

      refreshTokenRepository.findByMember(userDetails.getMember())
          .ifPresentOrElse(
              token -> {
                  token.updateToken(refreshToken, expiryDate);
                  refreshTokenRepository.save(token); // 명시적으로 저장
              },
              () -> refreshTokenRepository.save(RefreshToken.builder()
                  .member(userDetails.getMember())
                  .token(refreshToken)
                  .expiryDate(expiryDate)
                  .build())
          );
  }


  private Cookie createCookie(String key, String value) {
    Cookie cookie = new Cookie(key, value);
    cookie.setMaxAge((int) jwtTokenProvider.getRefreshTokenExpirationTime());
    cookie.setPath("/");
    cookie.setHttpOnly(true);
    // cookie.setSecure(true); // HTTPS 시 활성화
    return cookie;
  }

  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException failed) {
    response.setStatus(401);
    log.warn("Authentication failed: {}", failed.getMessage());
  }
}
