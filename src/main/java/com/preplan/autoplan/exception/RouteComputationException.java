package com.preplan.autoplan.exception;

public class RouteComputationException extends RuntimeException {
    public RouteComputationException(String message) {
        super(message);
    }

    public RouteComputationException(String message, Throwable cause) {
        super(message, cause);
    }
}
