package com.preplan.autoplan.googleApi;

import java.time.Duration;
import java.util.List;

//google api와의 통신용
//Plan에 저장시킬 수 있음. Route의 정보(Polyline, 소요 시간, 거리)
public record ComputeRoutesResponse(
        List<Route> routes) {

    public ComputeRoutesResponse {
        if (routes == null || routes.isEmpty()) {
            throw new IllegalStateException("No routes returned from API");
        }
    }

    public record Route(
            int distanceMeters,
            String duration,
            Polyline polyline,
            List<Leg> legs) {

        public Duration parsedDuration() {
            if (duration.endsWith("s")) {
                return Duration.ofSeconds(Long.parseLong(duration.replace("s", "")));
            }
            return Duration.parse("PT" + duration.toUpperCase().replace(" ", ""));
        }

        public record Leg(
                int distanceMeters,
                String duration,
                Polyline polyline) {

        }
    }

    public record Polyline(
            String encodedPolyline) {

    }
}