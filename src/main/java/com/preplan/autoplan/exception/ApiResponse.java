package com.preplan.autoplan.exception;

import lombok.Builder;

@Builder
public record ApiResponse<T>(
    String status, // "SUCCESS" or "ERROR"
    String code,   // "SUCCESS" or "C001", "M001" 등
    String message,
    T data
) {

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status("SUCCESS")
                .code("SUCCESS")
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success() {
        return success(null);
    }

    public static ApiResponse<Void> error(ErrorCode errorCode) {
        return ApiResponse.<Void>builder()
                .status("ERROR")
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
    }

    public static ApiResponse<Void> error(ErrorCode errorCode, String message) {
        return ApiResponse.<Void>builder()
                .status("ERROR")
                .code(errorCode.getCode())
                .message(message)
                .build();
    }
}
