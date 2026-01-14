package com.preplan.autoplan.repository;

import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.dto.plan.PlanRequestDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PlanRepositoryCustom {
  Page<Plan> findByCriteria(PlanRequestDto planRequestDto, Pageable pageable);
}
