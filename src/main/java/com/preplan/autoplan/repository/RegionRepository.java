package com.preplan.autoplan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.preplan.autoplan.domain.planPlace.Region;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {

    Optional<Region> findByName(String name); // 지역 이름으로 찾기

    Optional<Region> findByNameAndType(String name, String type); // 지역 이름과 타입으로 찾기

    List<Region> findByType(String type); // 타입으로 지역 찾기

//  List<Region> findByParentId(Long parentId);
}
