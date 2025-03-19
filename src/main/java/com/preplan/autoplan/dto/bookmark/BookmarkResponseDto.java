package com.preplan.autoplan.dto.bookmark;

import java.time.LocalDateTime;

//북마크 정보 반환, 사용자의 북마크 목록 조회
public record BookmarkResponseDto(
    Long id,
    Long memberId,
    Long planId,
    LocalDateTime createdAt
) {

}