package com.preplan.autoplan.config;

import com.preplan.autoplan.service.MemberSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final MemberSecurityService memberSecurityService;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            // 모든 사용자가 접근 가능한 경로들
            .requestMatchers(
                "/", "/home", "/login", "/members/new", // 기본 페이지
                "/css/**", "/js/**", "/icon/**", "/img/**", "/fragments/**", // 정적 리소스
                "/api/google-maps-key", "/api/public/**", // 공개 API
                "/plan/**", "/hotContent/**", "/autoContent/**", "/selfContent/**" // 공개 컨텐츠 페이지
            ).permitAll()
            .anyRequest().authenticated())
        .csrf(csrf -> csrf
            // API 경로에 대해서는 CSRF 보호 비활성화
            // 요청 허용했다고 검증을 거치지 않는게 아니라, CSRF 보안 로직을 거치는데, 보호 토큰이 발행되지 않음.
            // 즉, CSRF 보호를 비활성화 해야 함
            .ignoringRequestMatchers("/api/public/**", "/api/google-maps-key", "/api/auth/status"))
        .formLogin(form -> form
            .loginPage("/login") // 커스텀 로그인 페이지
            .defaultSuccessUrl("/plan", true) // 로그인 성공 시 리다이렉트 될 기본 URL
            .usernameParameter("email") // 로그인 시 사용할 사용자 이름 파라미터 (기본값은 username)
            .failureUrl("/login?error") // 로그인 실패 시 이동할 URL
            .permitAll())
        .logout(logout -> logout
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout")) // 로그아웃 URL
            .logoutSuccessUrl("/plan") // 로그아웃 성공 시 리다이렉트 될 URL
            .invalidateHttpSession(true) // 세션 무효화
        );

    return http.build();
  }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
      throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }
}