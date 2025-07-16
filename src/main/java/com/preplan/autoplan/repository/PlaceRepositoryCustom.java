package com.preplan.autoplan.repository;

import java.util.List;

import com.preplan.autoplan.domain.planPlace.Place;
import com.preplan.autoplan.dto.place.ComplexSearchDto;

public interface PlaceRepositoryCustom {
  List<Place> findByComplexSearch(ComplexSearchDto searchDto);

}
