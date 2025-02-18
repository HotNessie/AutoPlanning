package com.preplan.autoplan.googleApi;

import java.util.List;

public record ComputeRoutesResponse(
    List<Route> routes
) {

    public record Route(
        int distanceMeters,
        String duration,
        Polyline polyline,
        List<Leg> legs
    ) {

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
        String travelMode
    ) {

    }
}