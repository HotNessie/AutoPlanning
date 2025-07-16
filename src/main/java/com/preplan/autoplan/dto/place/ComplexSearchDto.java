package com.preplan.autoplan.dto.place;

import java.util.List;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;

public record ComplexSearchDto(
    String name, // 장소 이름
    String regionName, // 지역 이름
    String regionType, // 지역 타입
    String address, // 주소
    Long averageStayTime, // 평균 체류 시간
    Integer searchCount, // 검색 횟수
    String placeId, // 장소 ID
    List<PurposeField> purposeKeywords, // 목적 키워드
    List<MoodField> moodKeywords // 기분 키워드
) {
}
