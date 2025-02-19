package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import java.time.Duration;
import java.util.List;

public record ComputeRoutesResponse(
    List<Route> routes
) {

    public ComputeRoutesResponse {
        if (routes == null || routes.isEmpty()) {
            throw new IllegalStateException("No routes returned from API");
        }
    }

    public record Route(
        int distanceMeters,
        String duration,
        Polyline polyline,
        List<Leg> legs
    ) {

        public Duration parsedDuration() {
            if (duration.endsWith("s")) {
                return Duration.ofSeconds(Long.parseLong(duration.replace("s", "")));
            }
            return Duration.parse("PT" + duration.toUpperCase().replace(" ", ""));
        }

        public record Leg(
            int distanceMeters,
            String duration,
            Location startLocation,
            Location endLocation,
            List<Step> steps
        ) {

        }

        public record Polyline(
            String encodedPolyline
        ) {

        }

        public record Location(
            LatLng latLng
        ) {

            public record LatLng(
                double latitude,
                double longitude
            ) {

            }
        }
    }

    public record Step(
        int distanceMeters,
        String instruction,
        Transport travelMode
    ) {

    }
}