package com.preplan.autoplan.apiController.place;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.place.PlaceCreateRequestDto;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public class PlaceController {

    //placeService작성하셈

    //특정 장소의 상세 정보 반환
//    @GetMapping("/places/{id}")
//    public ResponseEntity<PlaceResponseDto> getPlace(@PathVariable Long id) {
//        Place place = placeService.findById(id);
//        PlaceResponseDto dto = new PlaceResponseDto(
//            place.getId(),
//            place.getPlaceId(),
//            place.getName(),
//            place.getAddress(),
//            place.getLatitude(),
//            place.getLongitude(),
//            place.getSearchCount(),
//            place.getTopPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//            place.getTopMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//            place.getAverageStayTime()
//        );
//        return ResponseEntity.ok(dto);
//    }

    //검색 or 추천된 장소 목록 반환
//    @GetMapping("/places/search")
//    public ResponseEntity<List<PlaceResponseDto>> searchPlaces(@RequestParam String keyword) {
//        List<Place> places = placeService.searchByKeyword(keyword);
//        List<PlaceResponseDto> dtos = places.stream()
//            .map(place -> new PlaceResponseDto(
//                place.getId(),
//                place.getPlaceId(),
//                place.getName(),
//                place.getAddress(),
//                place.getLatitude(),
//                place.getLongitude(),
//                place.getSearchCount(),
//                place.getTopPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//                place.getTopMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//                place.getAverageStayTime()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

    //장소 추가
//    @PostMapping("/places")
//    public ResponseEntity<PlaceResponseDto> createPlace(@RequestBody PlaceCreateRequestDto dto) {
//        // 중복 확인: placeId로 기존 장소가 있는지 확인
//        Place existingPlace = placeService.findByPlaceId(dto.placeId());
//        if (existingPlace != null) {
//            existingPlace.increaseSearchCount(); // 검색 횟수 증가
//            PlaceResponseDto response = new PlaceResponseDto(
//                existingPlace.getId(),
//                existingPlace.getPlaceId(),
//                existingPlace.getName(),
//                existingPlace.getAddress(),
//                existingPlace.getLatitude(),
//                existingPlace.getLongitude(),
//                existingPlace.getSearchCount(),
//                existingPlace.getTopPurposeKeywords().stream().map(Enum::name)
//                    .collect(Collectors.toList()),
//                existingPlace.getTopMoodKeywords().stream().map(Enum::name)
//                    .collect(Collectors.toList()),
//                existingPlace.getAverageStayTime()
//            );
//            return ResponseEntity.ok(response);
//        }
//
//        // 새로운 장소 생성
//        Place place = Place.builder()
//            .placeId(dto.placeId())
//            .name(dto.name())
//            .address(dto.address())
//            .latitude(dto.latitude())
//            .longitude(dto.longitude())
//            .build();
//        place.increaseSearchCount(); // 최초 검색 횟수 1 증가
//        Place savedPlace = placeService.save(place);
//        PlaceResponseDto response = new PlaceResponseDto(
//            savedPlace.getId(),
//            savedPlace.getPlaceId(),
//            savedPlace.getName(),
//            savedPlace.getAddress(),
//            savedPlace.getLatitude(),
//            savedPlace.getLongitude(),
//            savedPlace.getSearchCount(),
//            savedPlace.getTopPurposeKeywords().stream().map(Enum::name)
//                .collect(Collectors.toList()),
//            savedPlace.getTopMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
//            savedPlace.getAverageStayTime()
//        );
//        return ResponseEntity.ok(response);
//    }
}
