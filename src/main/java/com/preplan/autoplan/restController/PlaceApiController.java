package com.preplan.autoplan.restController;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.place.PlaceCreateRequestDto;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
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

  // Title - 장소Id로 검색
  @GetMapping("/api/public/places/id/{placeId}")
  public ResponseEntity<Place> getPlace(@PathVariable String placeId) {
    log.info("Place API 호출됨 - 장소Id: {}", placeId);
    Place place = placeService.findByPlaceId(placeId);
    return ResponseEntity.ok(place);
  }

  // Title - 장소명으로 검색
  @GetMapping("/api/public/places/search")
  public ResponseEntity<List<PlaceResponseDto>> searchPlacesByName(@RequestParam String name) {
    log.info("장소 검색 요청: {}", name);
    List<PlaceResponseDto> places = placeService.searchPlacesByName(name);
    return ResponseEntity.ok(places);
  }

  // Title - 장소 생성 또는 업데이트
  @PostMapping("/api/public/places")
  public ResponseEntity<PlaceResponseDto> createOrUpdatePlace(@RequestBody PlaceCreateRequestDto place) {
    log.info("장소 생성/업데이트 요청: {}", place);
    PlaceResponseDto createdPlace = placeService.createOrUpdatePlace(place);
    return ResponseEntity.ok(createdPlace);
  }

  // Title - 인기 장소 조회
  @GetMapping("/api/public/places/popular")
  public ResponseEntity<List<PlaceResponseDto>> getPopularPlaces() {
    log.info("인기 장소 조회 요청");
    List<PlaceResponseDto> popularPlaces = placeService.getPopularPlaces();
    return ResponseEntity.ok(popularPlaces);
  }
}
