package com.preplan.autoplan.googleApi;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;

public record ComputeRoutesRequest(
    @Valid Location origin,
    @Valid Location destination,
    //리스트 이래도 됨?
    @Valid Location[] intermediates, // 리스트 10개 이하로 제한해야 됨. 11개부터 돈 더나감
    String travelMode,
    String languageCode
) {

    public record Location(
        @JsonProperty("latitude") Latlng latlng
    ) {

    }

    public record Latlng(
        @JsonProperty("lat") double lat,
        @JsonProperty("lng") double lng
    ) {

    }

}