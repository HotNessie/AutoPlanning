package com.preplan.autoplan.dto.plan;

import java.util.List;

// Plan의 키워드 목록 수정을 위한 요청 DTO
public record PlanKeywordsUpdateRequestDto(List<String> keywords) {
}
