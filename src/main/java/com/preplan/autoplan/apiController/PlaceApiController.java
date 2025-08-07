package com.preplan.autoplan.apiController;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.place.ComplexSearchDto;
import com.preplan.autoplan.dto.place.PlaceCreateRequestDto;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import com.preplan.autoplan.exception.PlaceNotFoundException;
import com.preplan.autoplan.service.PlaceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PlaceApiController {

    private final PlaceService placeService;

    // 장소Id로 검색
    @GetMapping("/api/public/places/id/{placeId}")
    // public ResponseEntity<PlaceResponseDto> getPlace(@RequestParam String
    // placeId) {
    public ResponseEntity<Place> getPlace(@PathVariable String placeId) {
        log.info("Place API 호출됨");
        try {
            Place place = placeService.findByPlaceId(placeId);
            return ResponseEntity.ok(place);// TODO: Entity직접 반환임 수정필요
        } catch (PlaceNotFoundException e) {
            log.error("장소 검색 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("장소Id 검색 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    // 장소명으로 검색
    @GetMapping("/api/public/places/search")
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
    @PostMapping("/api/private/places")
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
    @GetMapping("/api/public/places/keywords")
    public ResponseEntity<List<PlaceResponseDto>> searchKeywordPlaces(
            @RequestParam(required = false) List<PurposeField> purposeKeywords,
            @RequestParam(required = false) List<MoodField> moodKeywords) {
        log.info("키워드로 장소 검색 요청: 목적={}, 기분={}", purposeKeywords, moodKeywords);
        ComplexSearchDto complexSearchDto = new ComplexSearchDto(
                null, null, null, null, null, null, null, purposeKeywords, moodKeywords);
        try {
            List<PlaceResponseDto> places = placeService.searchPlaces(complexSearchDto);
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

    // 지역으로 검색
    @GetMapping("/api/public/places/region")
    public ResponseEntity<List<PlaceResponseDto>> searchPlacesByRegion(
            @RequestParam String regionName) {
        log.info("지역으로 장소 검색 요청: {}", regionName);
        try {
            ComplexSearchDto complexDto = new ComplexSearchDto(
                    null, regionName, null, null, null, null, null, null, null);
            List<PlaceResponseDto> places = placeService.searchPlaces(complexDto);
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

    @PostMapping("/api/public/places/search/complex")
    public ResponseEntity<List<PlaceResponseDto>> searchPlaces(
            @RequestBody ComplexSearchDto complexSearchDto) {
        log.info("복합 검색 요청: {}", complexSearchDto);
        try {
            List<PlaceResponseDto> places = placeService.searchPlaces(complexSearchDto);
            if (places.isEmpty()) {
                log.warn("복합 검색 결과가 없습니다: ", complexSearchDto);
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            log.error("복합 검색 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}
