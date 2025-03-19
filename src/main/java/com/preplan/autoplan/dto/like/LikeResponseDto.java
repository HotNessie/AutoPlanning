package com.preplan.autoplan.dto.like;

import java.time.LocalDateTime;

//계획에 대한 좋아요 반환
public record LikeResponseDto(
    Long id,
    Long memberId,
    Long planId, //place용은 만들지 마?
    LocalDateTime createdAt //이거 필요할까
) {

}