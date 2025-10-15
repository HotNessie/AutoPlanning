package com.preplan.autoplan.repository;

import com.preplan.autoplan.domain.planPlace.Route;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // 애초에 Route는 repository가 필요한가? ㅇㅇ 존나필요해~
public interface RouteRepository extends JpaRepository<Route, Long> {
  Optional<Route> findById(Long id);

  List<Route> findByPlanId(Long planId);

}
