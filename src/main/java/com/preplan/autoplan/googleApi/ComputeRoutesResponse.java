package com.preplan.autoplan.googleApi;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

public record ComputeRoutesResponse(
    List<Route> routes
) {

    public record Route(
        String duration,
        int distanceMeters,
        Polyline polyline
    ) {

    }

    public record Polyline(
        String encodedPolyline
    ) {

    }
}