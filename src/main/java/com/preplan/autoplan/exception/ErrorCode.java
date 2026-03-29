package com.preplan.autoplan.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "올바르지 않은 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C002", "지원하지 않는 HTTP 메서드입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C003", "서버 내부 오류가 발생했습니다."),
    ENTITY_NOT_FOUND(HttpStatus.BAD_REQUEST, "C004", "대상을 찾을 수 없습니다."),

    // Member
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "M001", "존재하지 않는 회원입니다."),
    EMAIL_DUPLICATION(HttpStatus.BAD_REQUEST, "M002", "이미 가입된 이메일입니다."),
    LOGIN_INPUT_INVALID(HttpStatus.BAD_REQUEST, "M003", "이메일 또는 비밀번호가 일치하지 않습니다."),

    // Auth (JWT)
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "A001", "토큰이 만료되었습니다."),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "A002", "유효하지 않은 토큰입니다."),
    TOKEN_REUSE_DETECTED(HttpStatus.FORBIDDEN, "A003", "토큰 재사용이 감지되어 보안을 위해 모든 세션이 종료되었습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A004", "인증이 필요한 서비스입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "A005", "권한이 없습니다."),

    // Plan / Place
    PLACE_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "존재하지 않는 장소입니다."),
    PLAN_NOT_FOUND(HttpStatus.NOT_FOUND, "P002", "존재하지 않는 계획입니다."),
    REGION_NOT_FOUND(HttpStatus.NOT_FOUND, "P003", "존재하지 않는 지역입니다."),
    ROUTE_COMPUTATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "P004", "경로 계산 중 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
