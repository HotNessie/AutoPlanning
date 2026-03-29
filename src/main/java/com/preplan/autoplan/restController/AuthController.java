package com.preplan.autoplan.restController;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.token.RefreshToken;
import com.preplan.autoplan.repository.MemberRepository;
import com.preplan.autoplan.repository.token.RefreshTokenRepository;
import com.preplan.autoplan.security.jwt.JwtTokenProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class AuthController {

  private final JwtTokenProvider jwtTokenProvider;
  private final RefreshTokenRepository refreshTokenRepository;
  private final MemberRepository memberRepository;

  @PostMapping("/logout")
  public void logout(HttpServletResponse response) {
    Cookie cookie = new Cookie("refresh_token", null);
    cookie.setMaxAge(0);
    cookie.setPath("/");
    response.addCookie(cookie);
    // 클라이언트 측 변수(Access Token)는 JS에서 초기화 필요
  }

  @PostMapping("/reissue")
  public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

    // 1. 쿠키에서 Refresh Token 추출
    String refresh = null;
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (cookie.getName().equals("refresh_token")) {
          refresh = cookie.getValue();
        }
      }
    }

    if (refresh == null) {
      log.warn("[Reissue] Refresh token cookie is missing");
      return new ResponseEntity<>("Refresh token null", HttpStatus.BAD_REQUEST);
    }

    // 2. 검증 (만료 여부 및 카테고리 확인)
    if (!jwtTokenProvider.validateToken(refresh)) {
      log.warn("[Reissue] Refresh token validation failed");
      return new ResponseEntity<>("Invalid refresh token", HttpStatus.BAD_REQUEST);
    }

    String category = jwtTokenProvider.getCategory(refresh);
    if (!category.equals("refresh")) {
      log.warn("[Reissue] Token category is not refresh: {}", category);
      return new ResponseEntity<>("Invalid token category", HttpStatus.BAD_REQUEST);
    }

    // 3. DB에 저장된 토큰인지 확인
    Optional<RefreshToken> savedToken = refreshTokenRepository.findByToken(refresh);
    if (savedToken.isEmpty()) {
      // [보안 알림] 유효한 토큰이지만 DB에 없다? -> 이미 사용된 토큰을 누군가 재사용 시도함 (탈취 가능성)
      String email = jwtTokenProvider.getEmail(refresh);
      log.warn("⚠️ [SECURITY ALERT] Refresh Token reuse detected for user: {}. Deleting all tokens for safety.", email);

      // 해당 사용자의 모든 리프레시 토큰 삭제 (강제 로그아웃 처리)
      memberRepository.findByEmail(email).ifPresent(refreshTokenRepository::deleteByMember);

      return new ResponseEntity<>("Security threat detected. All sessions terminated. Please login again.",
          HttpStatus.FORBIDDEN);
    }

    Member member = savedToken.get().getMember();
    String email = member.getEmail();
    // 4. 새로운 토큰 생성 (RTR: Access & Refresh Rotation)
    String newAccess = jwtTokenProvider.generateAccessToken(email, member.getRole().name());
    String newRefresh = jwtTokenProvider.generateRefreshToken(email);

    // 5. DB 갱신
    savedToken.get().updateToken(newRefresh,
        LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshTokenExpirationTime()));
    refreshTokenRepository.save(savedToken.get());

    // 6. 응답 설정
    response.addCookie(createCookie("refresh_token", newRefresh));
    response.setHeader("Authorization", "Bearer " + newAccess);

    Map<String, String> tokens = new HashMap<>();
    tokens.put("token", newAccess);

    log.info("[Reissue] Token successfully reissued for user: {}", email);
    return new ResponseEntity<>(tokens, HttpStatus.OK);
  }

  private Cookie createCookie(String key, String value) {
    Cookie cookie = new Cookie(key, value);
    cookie.setMaxAge((int) jwtTokenProvider.getRefreshTokenExpirationTime());
    cookie.setPath("/");
    cookie.setHttpOnly(true);
    return cookie;
  }

  @GetMapping("/status")
  public ResponseEntity<Map<String, Object>> checkAuthStatus(Authentication authentication) {
    Map<String, Object> authStatus = new HashMap<>();

    if (authentication != null && authentication.isAuthenticated()
        && !(authentication.getPrincipal() instanceof String
            && authentication.getPrincipal().equals("anonymousUser"))) {
      authStatus.put("loggedIn", true);
      authStatus.put("username", authentication.getName());
      List<String> authorities = authentication.getAuthorities().stream()
          .map(grantedAuthority -> grantedAuthority.getAuthority())
          .collect(Collectors.toList());
      authStatus.put("authorities", authorities);
      return ResponseEntity.ok(authStatus);
    } else {
      authStatus.put("loggedIn", false);
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(authStatus);
    }
  }
}
