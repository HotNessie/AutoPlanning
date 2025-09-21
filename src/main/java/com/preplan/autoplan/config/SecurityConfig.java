package com.preplan.autoplan.config;

import com.preplan.autoplan.jwt.JwtAuthenticationEntryPoint;
import com.preplan.autoplan.jwt.JwtFilter;
import com.preplan.autoplan.jwt.LoginFilter;
import com.preplan.autoplan.jwt.JwtTokenProvider;
import com.preplan.autoplan.security.CustomUserDetailsManager;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final AuthenticationConfiguration authenticationConfiguration;
  private final JwtTokenProvider jwtTokenProvider;

  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final CustomUserDetailsManager userDetailsManager;

  // @Bean
  // public PasswordEncoder passwordEncoder() {
  // return new BCryptPasswordEncoder(); // 기본임
  // // Argon2로 바꿀까 BCrypt 뚫린다는 말이 있음 *너.. 요즘 말나와..
  // }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
      throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
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
                "/api/auth/login", "/api/auth/status", // 로그인 및 상태 확인 API
                "/plan/**", "/hotContent/**", "/autoContent/**", "/selfContent/**" // 공개 컨텐츠 페이지
            ).permitAll()
            .requestMatchers("/admin").hasRole("ADMIN")// TODO: 관리자용 추가하기
            .anyRequest().authenticated())
        // TODO: formLogin -> jwt로 변경 확인 필요
        .csrf(csrf -> csrf
            // API 경로에 대해서는 CSRF 보호 비활성화
            // 요청 허용했다고 검증을 거치지 않는게 아니라, CSRF 보안 로직을 거치는데, 보호 토큰이 발행되지 않음.
            // 즉, CSRF 보호를 비활성화 해야 함
            // TODO: StateLess로 변경하면서 csrf 보호가 동작하지 않을 것 -> 비활성화 하거나,
            // .ignoringRequestMatchers("/api/public/**", "/api/google-maps-key",
            // "/api/auth/**"))
            .disable())
        .httpBasic(httpBasic -> httpBasic.disable())
        .formLogin(form -> form.disable())
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        // .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        )
        .userDetailsService(userDetailsManager)
        // ? 이건 모임?
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .addFilterBefore(new JwtFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
        .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtTokenProvider),
            UsernamePasswordAuthenticationFilter.class);

    // TODO: JwtAuthenticationFilter 구현해서 토큰 기반 인증으로 수정하기 (formLogin이랑 logout)
    // .formLogin(form -> form
    // .loginPage("/login") // 커스텀 로그인 페이지
    // .defaultSuccessUrl("/plan", true) // 로그인 성공 시 리다이렉트 될 기본 URL
    // .usernameParameter("email") // 로그인 시 사용할 사용자 이름 파라미터 (기본값은 username)
    // .failureUrl("/login?error") // 로그인 실패 시 이동할 URL
    // )
    // .logout(logout -> logout
    // .logoutRequestMatcher(new AntPathRequestMatcher("/logout")) // 로그아웃 URL
    // .logoutSuccessUrl("/plan") // 로그아웃 성공 시 리다이렉트 될 URL
    // .invalidateHttpSession(true) // 세션 무효화
    // )
    ;

    return http.build();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsManager);
    authProvider.setPasswordEncoder(new BCryptPasswordEncoder());
    return authProvider;
  }
}