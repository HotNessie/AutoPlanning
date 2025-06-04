package com.preplan.autoplan.googleApi;

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RouteValidationService { // front 에서 검증 하긴 했지만 한번 더 검증

    public void validateRequest(ComputeRoutesRequest request) {
        if (request.placeNames() == null || request.placeNames().size() < 2) {
            throw new IllegalArgumentException("최소 2개 이상의 장소가 필요합니다");
        }

        if (request.placeNames().size() > 7) {
            throw new IllegalArgumentException("최대 7개까지 장소를 설정할 수 있습니다");
        }

        // 각 장소의 placeId 검증
        request.placeNames().forEach(place -> {
            if (place.placeId() == null || place.placeId().trim().isEmpty()) {
                throw new IllegalArgumentException("모든 장소의 ID가 필요합니다: " + place.name());
            }
        });
    }
}
