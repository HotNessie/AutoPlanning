package com.preplan.autoplan.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.preplan.autoplan.security.CustomUserDetails;

/*
 * JWT 인증을 처리하는 필터 / 기존 UsernamePasswordAuthenticationFilter를 확장, 대체
 * 사용자가 로그인 시도 시, 이 필터가 동작하여 인증을 처리
 */
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    // TITLE - 인증 시도
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        String username = obtainUsername(request);
        String password = obtainPassword(request);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password,
                null);

        return authenticationManager.authenticate(authToken);

    }

    // TITLE - 인증 성공 시
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            FilterChain chain, Authentication authResult) {
        // 인증 성공 후 JWT 토큰 생성 및 응답 헤더에 추가하는 로직 구현
        // String token = jwtTokenProvider.createToken(authResult);
        // response.addHeader("Authorization", "Bearer " + token);
        CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
        String username = userDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority authority = iterator.next();

        String role = authority.getAuthority();

        String token = jwtTokenProvider.generateToken(username, role, jwtTokenProvider.expirationTime * 1000);
        response.addHeader("Authorization", "Bearer " + token);
    }

    // TITLE - 인증 실패 시
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
