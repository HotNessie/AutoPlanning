package com.preplan.autoplan.exception;

public class RouteComputationException extends BusinessException {
    public RouteComputationException() {
        super(ErrorCode.ROUTE_COMPUTATION_FAILED);
    }

    public RouteComputationException(String message) {
        super(ErrorCode.ROUTE_COMPUTATION_FAILED, message);
    }
}
