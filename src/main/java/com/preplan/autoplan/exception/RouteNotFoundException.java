package com.preplan.autoplan.exception;

public class RouteNotFoundException extends BusinessException {
    public RouteNotFoundException() {
        super(ErrorCode.ROUTE_COMPUTATION_FAILED, "경로를 찾을 수 없습니다.");
    }

    public RouteNotFoundException(String message) {
        super(ErrorCode.ROUTE_COMPUTATION_FAILED, message);
    }
}
