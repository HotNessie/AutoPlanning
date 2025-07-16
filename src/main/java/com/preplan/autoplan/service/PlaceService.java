package com.preplan.autoplan.service;

import com.preplan.autoplan.repository.RegionRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.domain.planPlace.Region;
import com.preplan.autoplan.dto.place.ComplexSearchDto;
import com.preplan.autoplan.dto.place.PlaceCreateRequestDto;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import com.preplan.autoplan.exception.PlaceNotFoundException;
import com.preplan.autoplan.repository.PlaceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final RegionService regionService;
    private final RegionRepository regionRepository;

    /*
     * findByPlaceId placeId로 찾기
     * searchPlacesByName 이름으로 찾기
     * searchPlaces (복합)
     * createOrUpdatePlace 생성 or 업데이트
     * processAddressAndCreateRegions address에서 region 추출
     */

    // 장소 찾기 By placeId
    @Transactional(readOnly = true)
    public PlaceResponseDto findByPlaceId(String placeId) {
        Place place = placeRepository.findByPlaceId(placeId)
                .orElseThrow(() -> new PlaceNotFoundException("해당 장소가 없습니다: " + placeId));
        place.increaseSearchCount(); // 검색 횟수 증가
        return convertToDto(place);
    }

    // 찾찾 By placeName
    @Transactional(readOnly = true)
    public List<PlaceResponseDto> searchPlacesByName(String name) {
        List<Place> places = placeRepository.findByName(name);
        return convertToDtoList(places);
    }

    // 복합 검색
    @Transactional(readOnly = true)
    public List<PlaceResponseDto> searchPlaces(ComplexSearchDto complexSearchDto) {
        List<Place> places = placeRepository.findByComplexSearch(
                complexSearchDto);
        return convertToDtoList(places);
    }

    // 저. 기본 저장
    @Transactional
    public Place save(Place place) { // 저장
        return placeRepository.save(place);
    }

    // 저. 장소 생성 or 업데이트
    @Transactional
    public Place createOrUpdatePlace(PlaceCreateRequestDto dto) {
        // 기존 장소 확인 (이게...)
        Optional<Place> place = placeRepository.findByPlaceId(dto.placeId());

        if (place.isPresent()) { // 장소가 이미 있으면
            // 검색 횟수 증가
            Place existingPlace = place.get();
            existingPlace.increaseSearchCount(); // 장소 있으면 그냥 searchCount만 증가
            return placeRepository.save(existingPlace); // 저장
        } else {
            // 장소가 없으면 새로 생성
            Region district = processAddressAndCreateRegions(dto.address());
            Place newPlace = Place.builder()
                    .placeId(dto.placeId())
                    .name(dto.name())
                    .address(dto.address())
                    .latitude(dto.latitude())
                    .longitude(dto.longitude())
                    .region(district) // 지역 설정
                    .build();
            newPlace.increaseSearchCount(); // 최초 검색 횟수 1 증가
            return placeRepository.save(newPlace); // 저장
        }
    }

    // 로. address에서 region 추출
    private Region processAddressAndCreateRegions(String address) {
        String[] parts = address.split(" ");
        String country = parts[0];
        String city = parts[1];
        String district = parts[2];

        Region countryRegion = regionService.findOrCreateRegion(country, "COUNTRY");
        Region cityRegion = regionRepository.findByNameAndType(city, "CITY")
                .orElseGet(() -> {
                    Region newCityRegion = Region.builder()
                            .name(city)
                            .type("CITY")
                            .parent(countryRegion)
                            .build();
                    return regionService.save(newCityRegion);
                });
        return regionRepository.findByNameAndType(district, "DISTRICT")
                .orElseGet(() -> {
                    Region newDistrictRegion = Region.builder()
                            .name(district)
                            .type("DISTRICT")
                            .parent(cityRegion)
                            .build();
                    return regionService.save(newDistrictRegion);
                });
    }

    // 장소를 DTO로 변환
    public PlaceResponseDto convertToDto(Place place) {
        return new PlaceResponseDto(
                place.getId(),
                place.getPlaceId(),
                place.getName(),
                place.getAddress(),
                place.getLatitude(),
                place.getLongitude(),
                place.getSearchCount(),
                place.getTopPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
                place.getTopMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
                place.getAverageStayTime());
    }

    // 찾은 장소들을 DTO로 변환
    public List<PlaceResponseDto> convertToDtoList(List<Place> places) {
        return places.stream().map(this::convertToDto).collect(Collectors.toList());
    }
}
