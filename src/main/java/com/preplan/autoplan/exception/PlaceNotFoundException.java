package com.preplan.autoplan.exception;

public class PlaceNotFoundException extends BusinessException {
    public PlaceNotFoundException() {
        super(ErrorCode.PLACE_NOT_FOUND);
    }

    public PlaceNotFoundException(String message) {
        super(ErrorCode.PLACE_NOT_FOUND, message);
    }
}
