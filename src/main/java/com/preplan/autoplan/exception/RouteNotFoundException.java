package com.preplan.autoplan.exception;

public class RouteNotFoundException extends BusinessException {
    public RouteNotFoundException() {
        super(ErrorCode.ROUTE_COMPUTATION_FAILED, "경로를 찾을 수 없습니다."); // ErrorCode에 적절한 코드가 없어 일단 활용
    }
}
