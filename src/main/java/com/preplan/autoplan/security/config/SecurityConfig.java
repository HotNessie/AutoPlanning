package com.preplan.autoplan.security.config;

import com.preplan.autoplan.repository.token.RefreshTokenRepository;
import com.preplan.autoplan.security.filter.JwtAuthenticationFilter;
import com.preplan.autoplan.security.filter.JwtAuthorizationFilter;
import com.preplan.autoplan.security.handler.JwtAccessDeniedHandler;
import com.preplan.autoplan.security.handler.JwtAuthenticationEntryPoint;
import com.preplan.autoplan.security.jwt.JwtTokenProvider;
import com.preplan.autoplan.security.service.CustomUserDetailsService;
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
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final AuthenticationConfiguration authenticationConfiguration;
  private final JwtTokenProvider jwtTokenProvider;
  private final CustomUserDetailsService userDetailsService;
  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    // 1. CSRF, HTTP Basic, Form Login 비활성화
    http.csrf(csrf -> csrf.disable())
        .httpBasic(basic -> basic.disable())
        .formLogin(form -> form.disable())
        .logout(logout -> logout.disable());

    // 2. 세션 정책: Stateless
    http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    // 3. 인가 설정
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers(
            "/", "favicon.ico", "/home", "/login", "/logout", "/status", "/reissue", "/members/new",
            "/placeMain", "/placeDetail/**", "/searchPlans", "/error", "/h2-console/**",
            "/css/**", "/js/**", "/icon/**", "/img/**", "/fragments/**",
            "/api/google-maps-key", "/api/public/**",
            "/plan/**", "/hotContent/**", "/autoContent/**", "/selfContent/**", "/myPlanList/**")
        .permitAll()
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated());

    // 4. H2 Console 설정 (배포 시 제거)
    http.headers(headers -> headers.addHeaderWriter(
        new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)));

    // 5. 예외 핸들링
    http.exceptionHandling(exception -> exception
        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
        .accessDeniedHandler(jwtAccessDeniedHandler));

    // 6. 필터 추가
    JwtAuthenticationFilter loginFilter = new JwtAuthenticationFilter(
        authenticationManager(authenticationConfiguration), jwtTokenProvider, refreshTokenRepository);
    loginFilter.setUsernameParameter("email");

    http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(new JwtAuthorizationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
