package com.preplan.autoplan.exception;

public class PlaceNotFoundException extends BusinessException {
    public PlaceNotFoundException() {
        super(ErrorCode.PLACE_NOT_FOUND);
    }
}
