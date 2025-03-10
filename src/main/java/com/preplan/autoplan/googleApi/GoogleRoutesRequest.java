package com.preplan.autoplan.googleApi;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GoogleRoutesRequest(
        @JsonProperty("origin") Place origin,
        @JsonProperty("destination") Place destination,
        @JsonProperty("intermediates") List<Place> intermediates,
        @JsonProperty("travelMode") String travelMode,
        @JsonProperty("departureTime") String departureTime,
        @JsonProperty("routingPreference") String routingPreference,
        @JsonProperty("units") String units) {

    public record Place(
            @JsonProperty("placeId") String placeId,
            @JsonProperty("location") Location location) {

        public record Location(
                @JsonProperty("latLng") LatLng latLng) {

            public record LatLng(
                    @JsonProperty("latitude") double latitude,
                    @JsonProperty("longitude") double longitude) {
            }
        }
    }
}
