package com.preplan.autoplan.jwt;

import io.jsonwebtoken.Jwts;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Component
public class JwtTokenProvider {

    // private static final String AUTHORITIES_KEY = "auth";
    // private final String SECRET_KEY;
    public final SecretKey secretKey;
    public final long expirationTime;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKeyString,
            @Value("${jwt.access-token-validity-in-seconds}") long expirationTime) {
        this.secretKey = new SecretKeySpec(secretKeyString.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
        this.expirationTime = expirationTime;
    }

    // TITLE - 사용자 이름 추출
    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("email",
                String.class);
    }

    // TITLE - 사용자 권한 추출
    public String extractRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload()
                .get("role", String.class);
    }

    // TITLE - JWT 토큰 유효성 검사
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // TITLE - 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // TITLE - 토큰 만료 날짜 추출
    private Date extractExpiration(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration();
    }

    // TITLE - JWT 토큰 생성
    public String generateToken(String email, String role, Long expired) {

        return Jwts.builder()
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expired * 1000))
                .signWith(secretKey)
                .compact();
    }

    public long getExpirationTime() {
        return expirationTime;
    }

}
