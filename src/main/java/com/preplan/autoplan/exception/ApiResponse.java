package com.preplan.autoplan.exception;

public record ApiResponse<T>(
    String status,
    String message,
    T data
) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("SUCCESS", null, data);
    }

    // ApiError.java
    public record ApiError(
        String code,
        String message
    ) {

    }
}



