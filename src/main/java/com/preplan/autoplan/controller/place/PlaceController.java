package com.preplan.autoplan.controller.place;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.place.PlaceCreateRequestDto;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import com.preplan.autoplan.service.PlaceService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    // 장소 찾기 By id
    @GetMapping("/places/{id}") // 아무리 생각해도 id(pk)로 찾는건 아닌거 같음
    public ResponseEntity<PlaceResponseDto> getPlace(@PathVariable Long id) {
        Place place = placeService.findById(id);
        PlaceResponseDto dto = placeService.convertToDto(place);
        return ResponseEntity.ok(dto);
    }

    // 장소 찾기 By keyword
    @GetMapping("/places/search")
    public ResponseEntity<List<PlaceResponseDto>> searchPlaces(@RequestParam String keyword) {
        List<Place> places = placeService.searchByKeyword(keyword);
        List<PlaceResponseDto> dtos = places.stream()
                .map(placeService::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 장소 추가
    @PostMapping("/places")
    public ResponseEntity<PlaceResponseDto> createPlace(@RequestBody PlaceCreateRequestDto dto) {
        // 중복 확인: placeId로 기존 장소가 있는지 확인
        Place existingPlace = placeService.findByPlaceId(dto.placeId()); // 이거 말 안됨. 일단 dto의 id(pk)가 없는데 뭘 id로 찾냐
        PlaceResponseDto response = placeService.convertToDto(existingPlace);
        return ResponseEntity.ok(response);
    }
}
