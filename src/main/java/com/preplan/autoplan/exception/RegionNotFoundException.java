package com.preplan.autoplan.exception;

public class RegionNotFoundException extends BusinessException {
    public RegionNotFoundException() {
        super(ErrorCode.REGION_NOT_FOUND);
    }
}
