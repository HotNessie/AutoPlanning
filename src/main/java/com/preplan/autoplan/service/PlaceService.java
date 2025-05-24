package com.preplan.autoplan.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.preplan.autoplan.domain.planPlace.Place;
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

  @Transactional(readOnly = true)
  public Place findById(Long id) { // 찾찾 By id
    // 근데 id로 찾을 수 있는거 맞음? 찾을 수 있어도 별론데..
    return placeRepository.findById(id)
        .orElseThrow(() -> new PlaceNotFoundException("그런 장소는 없는데?: " + id));
  }

  @Transactional(readOnly = true)
  public Place findByPlaceId(String placeId) { // 찾찾 By placeId
    return placeRepository.findByPlaceId(placeId).orElse(null);
  }

  @Transactional(readOnly = true)
  public List<Place> searchByKeyword(String name) { // 찾찾 By placeId
    List<Place> places = placeRepository.findByName(name);
    places.forEach(Place::increaseSearchCount); // 검색 횟수 증가
    return places;
  }

  @Transactional(readOnly = true)
  public List<PlaceResponseDto> searchPlaces(
      String name, List<String> purposeKeywords, List<String> moodKeywords, String region) {// 찾찾 By placeName
    List<Place> places = placeRepository.findByCriteria(name, purposeKeywords, moodKeywords, region);
    return places.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  @Transactional
  public Place save(Place place) { // 저장
    return placeRepository.save(place);
  }

  @Transactional
  public Place createOrUpdatePlace(PlaceCreateRequestDto dto) {// 장소 생성(DB저장) or 업데이트
    // 기존 장소 확인
    Place place = findByPlaceId(dto.placeId());

    if (place != null) {
      // 검색 횟수 증가
      place.increaseSearchCount(); // 장소 있으면 그냥 searchCount만 증가
      return place;
    }

    // 새 장소 생성
    Place newPlace = Place.builder()
        .placeId(dto.placeId())
        .name(dto.name())
        .address(dto.address())
        .latitude(dto.latitude())
        .longitude(dto.longitude())
        .build();

    newPlace.increaseSearchCount(); // 최초 검색 횟수 1 증가
    return save(newPlace);
  }

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

  public List<PlaceResponseDto> convertToDtoList(List<Place> places) {
    return places.stream().map(this::convertToDto).collect(Collectors.toList());
  }
}
