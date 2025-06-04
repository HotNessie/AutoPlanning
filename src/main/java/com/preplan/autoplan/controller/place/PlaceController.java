package com.preplan.autoplan.controller.place;

import com.preplan.autoplan.service.PlaceService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    // 장소 찾기 By keyword
//    @GetMapping("/places/search")
//    public ResponseEntity<List<PlaceResponseDto>> searchPlaces(@RequestParam String name) {
//        List<PlaceResponseDto> places = placeService.searchPlacesByName(name);
//        return ResponseEntity.ok(places);
//    }
//
//    // 장소 추가
//    @PostMapping("/places")
//    public ResponseEntity<PlaceResponseDto> createPlace(@RequestBody PlaceCreateRequestDto dto) {
//        try {
//            // 중복 확인: placeId로 기존 장소가 있는지 확인
//            PlaceResponseDto existingPlace = placeService.findByPlaceId(dto.placeId());
//            return ResponseEntity.ok(existingPlace);
//        } catch (PlaceNotFoundException e) {
//            Place newPlace = placeService.createOrUpdatePlace(dto);
//            PlaceResponseDto response = placeService.convertToDto(newPlace);
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            // 예외 처리: 장소 생성 중 오류 발생
//            return ResponseEntity.status(500).body(null);
//        }
//    }
}
