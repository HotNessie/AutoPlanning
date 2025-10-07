package com.preplan.autoplan.service;

import com.preplan.autoplan.repository.RegionRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.domain.planPlace.Region;
import com.preplan.autoplan.dto.place.ComplexSearchDto;
import com.preplan.autoplan.dto.place.PlaceCreateRequestDto;
import com.preplan.autoplan.dto.place.PlaceResponseDto;
import com.preplan.autoplan.dto.region.RegionResponseDto;
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

  // Title - 장소 찾기 By placeId
  @Transactional(readOnly = true)
  public Place findByPlaceId(String placeId) {
    Place place = placeRepository.findByPlaceId(placeId)
        .orElseThrow(() -> new PlaceNotFoundException("해당 장소가 없습니다: " + placeId));
    place.increaseSearchCount(); // 검색 횟수 증가
    return place;
  }

  @Transactional(readOnly = true)
  public Place findByPlaceIdWithRegion(String placeId) {
    return placeRepository.findByPlaceIdWithRegion(placeId)
        .orElseThrow(() -> new PlaceNotFoundException("해당 장소가 없습니다: " + placeId));
  }

  // Title - 장소 찾기 By placeName
  @Transactional(readOnly = true)
  public List<PlaceResponseDto> searchPlacesByName(String name) {
    List<Place> places = placeRepository.findByName(name);
    return PlaceResponseDto.fromEntities(places);
  }

  // Title - 복합 검색
  @Transactional(readOnly = true)
  public List<PlaceResponseDto> searchPlaces(ComplexSearchDto complexSearchDto) {
    List<Place> places = placeRepository.findByComplexSearch(
        complexSearchDto);
    return PlaceResponseDto.fromEntities(places);
  }

  // Title - 기본 저장
  @Transactional
  public Place save(Place place) { // 저장
    return placeRepository.save(place);
  }

  // Title - 장소 생성 or 업데이트
  @Transactional
  public PlaceResponseDto createOrUpdatePlace(PlaceCreateRequestDto dto) {
    // 기존 장소 확인 (이게...)
    Optional<Place> place = placeRepository.findByPlaceId(dto.placeId());

    if (place.isPresent()) { // 장소가 이미 있으면
      // 검색 횟수 증가
      Place existingPlace = place.get();
      existingPlace.increaseSearchCount(); // 장소 있으면 그냥 searchCount만 증가
      return PlaceResponseDto.fromEntity(placeRepository.save(existingPlace)); // 저장
    } else {
      // 장소가 없으면 새로 생성
      // ? 구를 반환하려 했는데 그렇지 않은 경우는 (시)를 반환
      RegionResponseDto minRegion = processAddressAndCreateRegions(dto.address());
      RegionResponseDto parentRegion = RegionResponseDto
          .fromEntity(regionRepository.findById(minRegion.id()).orElse(null).getParent());
      RegionResponseDto cityRegion = minRegion.type().equals("CITY") ? minRegion : parentRegion;
      RegionResponseDto countryRegion = RegionResponseDto
          .fromEntity(regionRepository.findById(cityRegion.id()).orElse(null).getParent());

      Place newPlace = Place.builder()
          .placeId(dto.placeId())
          .name(dto.name())
          .address(dto.address())
          .latitude(dto.latitude())
          .longitude(dto.longitude())
          .region(RegionResponseDto.toEntity(minRegion)) // 지역 설정
          .cityRegion(RegionResponseDto.toEntity(cityRegion))
          .countryRegion(RegionResponseDto.toEntity(countryRegion))
          .build();
      newPlace.increaseSearchCount(); // 최초 검색 횟수 1 증가
      return PlaceResponseDto.fromEntity(placeRepository.save(newPlace)); // 저장
    }
  }

  // Title - address에서 region 추출
  private RegionResponseDto processAddressAndCreateRegions(String address) {
    String[] parts = address.split(" ");
    if (parts.length == 0) {
      throw new IllegalArgumentException("Invalid address format: " + address);
    }
    Region countryRegion = regionService.findOrCreateRegion(parts[0], "COUNTRY");

    Region cityRegion = regionRepository.findByNameAndType(parts[1], "CITY")
        .orElseGet(() -> {
          Region newCity = Region.builder()
              .name(parts[1])
              .type("CITY")
              .parent(countryRegion)
              .build();
          return regionRepository.save(newCity);
        });

    if (parts.length > 2) {
      Region districtRegion = regionRepository.findByNameAndType(parts[2], "DISTRICT")
          .orElseGet(() -> {
            Region newDistrict = Region.builder()
                .name(parts[2])
                .type("DISTRICT")
                .parent(cityRegion != null ? cityRegion : countryRegion)
                .build();
            return regionRepository.save(newDistrict);
          });
      return RegionResponseDto.fromEntity(districtRegion);
    } else {
      return RegionResponseDto.fromEntity(cityRegion);
    }
  }

  // // Title - 장소를 DTO로 변환
  // public PlaceResponseDto convertToDto(Place place) {
  // return new PlaceResponseDto(
  // place.getId(),
  // place.getPlaceId(),
  // place.getName(),
  // place.getAddress(),
  // place.getLatitude(),
  // place.getLongitude(),
  // place.getSearchCount(),
  // place.getTopPurposeKeywords().stream().map(Enum::name).collect(Collectors.toList()),
  // place.getTopMoodKeywords().stream().map(Enum::name).collect(Collectors.toList()),
  // place.getAverageStayTime(),
  // place.getRegion().getId());
  // }

  // // Title - 찾은 장소들을 DTO로 변환
  // public List<PlaceResponseDto> convertToDtoList(List<Place> places) {
  // return places.stream().map(this::convertToDto).collect(Collectors.toList());
  // }
}
