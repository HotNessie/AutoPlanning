package com.preplan.autoplan.service;

import java.util.Optional;
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

    public Region findByName(String name) { // 지역 찾기 By 이름
        return regionRepository.findByName(name)
                .orElseThrow(() -> new RegionNotFoundException("해당 지역이 없습니다: " + name));
    }

    @Transactional // 지역 생성 또는 찾기 ( 장소, 계획 생성시에만 사용 )
    public Region findOrCreateRegion(String regionName, String type) {
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

    @Transactional
    public Region save(Region newDistrictRegion) {
        return regionRepository.save(newDistrictRegion);
    }

    public Optional<Region> findByNameAndType(String name, String type) {
        return regionRepository.findByNameAndType(name, type);
    }

}
