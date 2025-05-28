package com.preplan.autoplan.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.preplan.autoplan.domain.planPlace.Region;
import com.preplan.autoplan.exception.RegionNotFoundException;
import com.preplan.autoplan.repository.RegionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RegionService {

  private final RegionRepository regionRepository;

  @Transactional
  public Region findOrCreateRegion(String regionName, String type) { // 지역 생성
    return regionRepository.findByNameAndType(regionName, type)
        .orElseGet(() -> {
          Region region = Region.builder()
              .name(regionName)
              .type(type)
              .build();
          return regionRepository.save(region);
        });
  }

  @Transactional(readOnly = true)
  public Region findById(Long id) { // 지역 찾기 By id
    return regionRepository.findById(id)
        .orElseThrow(() -> new RegionNotFoundException("해당 지역이 없습니다: " + id));
  }
}
