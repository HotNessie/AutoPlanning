package com.preplan.autoplan.repository;

import com.preplan.autoplan.domain.planPlace.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // 애초에 Route는 repository가 필요한가?
public interface RouteRepository extends JpaRepository<Route, Long> {

}
