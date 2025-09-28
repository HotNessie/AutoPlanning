package com.preplan.autoplan.dto.member;

/**
 * 로그인 응답 DTO
 */
public record LoginResponseDto(
    String accessToken,
    String tokenType) {
  public static LoginResponseDto of(String accessToken) {
    return new LoginResponseDto(accessToken, "Bearer");
  }
}
