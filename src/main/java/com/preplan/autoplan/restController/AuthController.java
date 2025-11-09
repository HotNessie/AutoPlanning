package com.preplan.autoplan.restController;

import com.preplan.autoplan.jwt.JwtTokenProvider;
import com.preplan.autoplan.service.MemberService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
// @RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final MemberService memberService;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  // ! LoginFilter에서 처리
  // /*
  // * Title - 로그인 인증
  // *

  @PostMapping("/logout")
  public void logout(HttpServletResponse response) throws IOException {
    Cookie cookie = new Cookie("jwt_token", null);
    cookie.setMaxAge(0);
    cookie.setPath("/");
    response.addCookie(cookie);

    response.sendRedirect("/login");
  }

  /*
   * Title - 로그인 인증 상태 확인 (JWT 토큰 기반)
   * 
   * @param authHeader Authorization 헤더 (Bearer 토큰)
   * 
   * @return 로그인 상태 정보
   */
  @GetMapping("/status")
  public ResponseEntity<Map<String, Object>> checkAuthStatus(
      Authentication authentication) {

    Map<String, Object> authStatus = new HashMap<>();

    log.info("Checking authentication status for user: {}",
        authentication != null ? authentication.getName() : "anonymous");

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
      return ResponseEntity.badRequest().body(authStatus);
      // return ResponseEntity.ok(authStatus); // 비로그인 상태도 200 OK로 응답
    }
  }
}
