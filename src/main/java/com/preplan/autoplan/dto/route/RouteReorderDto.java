package com.preplan.autoplan.dto.route;

public record RouteReorderDto(
    Long routeId,
    Integer newSequence) {
}
