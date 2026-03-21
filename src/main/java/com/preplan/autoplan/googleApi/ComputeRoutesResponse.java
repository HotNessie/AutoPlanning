package com.preplan.autoplan.googleApi;

import java.time.Duration;
import java.util.List;

public record ComputeRoutesResponse(
    List<Route> routes) {

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
  }

  public record Leg(
      int distanceMeters,
      String duration,
      Polyline polyline,
      List<Step> steps) {
  }

  public record Step(
      Polyline polyline,
      TransitDetails transitDetails) {
  }

  public record TransitDetails(
      TransitLine transitLine) {
  }

  public record TransitLine(
      String name,
      String shortName) {
  }

  public record Polyline(
      String encodedPolyline) {
  }
}