package com.preplan.autoplan.domain.planPlace;

import com.preplan.autoplan.dto.place.PlaceResponseDto;
import jakarta.persistence.*;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Place {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String placeId;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String address;

  @Column
  private Double latitude;

  @Column
  private Double longitude;

  @Column
  private int searchCount = 0;

  // 최소단위 지역(google search address반환값에 따라 기준이 다름)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "region_id", nullable = false)
  private Region region;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "city_region_id")
  private Region cityRegion;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "country_region_id")
  private Region countryRegion;

  @Column(nullable = false)
  private Long averageStayTime = 0L;

  @Builder
  public Place(String placeId, String name, String address, Double latitude, Double longitude, Region region,
      Region cityRegion, Region countryRegion) {
    this.placeId = placeId;
    this.name = name;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.region = region;
    this.cityRegion = cityRegion;
    this.countryRegion = countryRegion;
  }

  // 검색 횟수 증가
  public void increaseSearchCount() {
    this.searchCount++;
  }

  // 평균 체류 시간 업데이트
  public void updateAverageStayTime(Long newStayTime) {
    this.averageStayTime = (this.averageStayTime + newStayTime) / 2;
  }

  public static Place toEntity(PlaceResponseDto placeResponseDto) {
    return Place.builder()
        .placeId(placeResponseDto.placeId())
        .name(placeResponseDto.name())
        .address(placeResponseDto.address())
        .latitude(placeResponseDto.latitude())
        .longitude(placeResponseDto.longitude())
        .build();
  }
}