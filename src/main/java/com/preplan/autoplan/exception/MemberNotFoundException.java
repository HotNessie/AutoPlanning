package com.preplan.autoplan.exception;

public class MemberNotFoundException extends BusinessException {
    public MemberNotFoundException() {
        super(ErrorCode.MEMBER_NOT_FOUND);
    }

    public MemberNotFoundException(String message) {
        super(ErrorCode.MEMBER_NOT_FOUND, message);
    }
}
