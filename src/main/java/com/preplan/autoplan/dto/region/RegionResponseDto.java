package com.preplan.autoplan.dto.region;

import com.preplan.autoplan.domain.planPlace.Region;

public record RegionResponseDto(
    Long id,
    String name,
    String type,
    Long parentId) {
  public static RegionResponseDto fromEntity(Region region) {
    return new RegionResponseDto(
        region.getId(),
        region.getName(),
        region.getType(),
        region.getParent() != null ? region.getParent().getId() : null);
  }

  public static Region toEntity(RegionResponseDto dto) {
    return Region.builder()
        .name(dto.name())
        .type(dto.type())
        .build();
  }
}
