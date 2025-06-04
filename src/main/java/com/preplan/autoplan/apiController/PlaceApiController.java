package com.preplan.autoplan.apiController;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.place.PlaceCreateRequestDto;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import com.preplan.autoplan.exception.PlaceNotFoundException;
import com.preplan.autoplan.service.PlaceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PlaceApiController {

    private final PlaceService placeService;

    // 장소Id로 검색
    @GetMapping("/place")
    public ResponseEntity<PlaceResponseDto> getPlace(@RequestParam String placeId) {
        log.info("Place API 호출됨");
        try {
            PlaceResponseDto place = placeService.findByPlaceId(placeId);
            return ResponseEntity.ok(place);
        } catch (PlaceNotFoundException e) {
            log.error("장소 검색 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("장소Id 검색 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    // 장소명으로 검색
    @GetMapping("/places/search")
    public ResponseEntity<List<PlaceResponseDto>> searchPlacesByName(@RequestParam String name) {
        log.info("장소 검색 요청: {}", name);
        try {
            List<PlaceResponseDto> places = placeService.searchPlacesByName(name);
            if (places.isEmpty()) {
                log.warn("검색 결과가 없습니다: {}", name);
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            log.error("장소명 검색 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    // 장소 생성 또는 업데이트
    @PostMapping("/places")
    public ResponseEntity<Place> createOrUpdatePlace(PlaceCreateRequestDto place) {
        log.info("장소 생성/업데이트 요청: {}", place);
        try {
            Place createdPlace = placeService.createOrUpdatePlace(place);
            return ResponseEntity.ok(createdPlace);
        } catch (Exception e) {
            log.error("장소 생성/업데이트 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    // 키워드로 장소 검색
    @GetMapping("/places/keywords")
    public ResponseEntity<List<PlaceResponseDto>> searchKeywordPlaces(
        @RequestParam(required = false) List<PurposeField> purposeKeywords,
        @RequestParam(required = false) List<MoodField> moodKeywords) {
        log.info("키워드로 장소 검색 요청: 목적={}, 기분={}", purposeKeywords, moodKeywords);
        try {
            List<PlaceResponseDto> places = placeService.searchKeywordPlaces(purposeKeywords, moodKeywords);
            if (places.isEmpty()) {
                log.warn("키워드 장소 검색 결과가 없습니다: 목적={}, 기분={}", purposeKeywords, moodKeywords);
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            log.error("키워드 검색 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    //지역으로 검색
    @GetMapping("/places/region")
    public ResponseEntity<List<PlaceResponseDto>> searchPlacesByRegion(
        @RequestParam String regionName) {
        log.info("지역으로 장소 검색 요청: {}", regionName);
        try {
            List<PlaceResponseDto> places = placeService.searchPlacesByRegion(regionName);
            if (places.isEmpty()) {
                log.warn("region 장소 검색 결과가 없습니다: {}", regionName);
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            log.error("지역 검색 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    //복합 검색
    @GetMapping("/places/search/complex")
    public ResponseEntity<List<PlaceResponseDto>> searchPlaces(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) List<PurposeField> purposeKeywords,
        @RequestParam(required = false) List<MoodField> moodKeywords,
        @RequestParam(required = false) String regionName) {
        log.info("복합 검색 요청: 이름={}, 목적={}, 기분={}, 지역={}",
            name, purposeKeywords, moodKeywords, regionName);
        try {
            List<PlaceResponseDto> places = placeService.searchPlaces(name, purposeKeywords, moodKeywords, regionName);
            if (places.isEmpty()) {
                log.warn("복합 검색 결과가 없습니다: 이름={}, 목적={}, 기분={}, 지역={}",
                    name, purposeKeywords, moodKeywords, regionName);
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            log.error("복합 검색 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}
