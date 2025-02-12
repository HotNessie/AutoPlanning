package com.preplan.autoplan.googleApi;


public record ComputeRoutesRequest(
    Location origin,
    Location destination,
    String travelMode,
    String languageCode
) {

    public record Location(
        String address,
        LatLng location
    ) {

    }

    //검색하고 latlng받아서 넘겨야 됨
    public record LatLng(
        double latitude,
        double longitude
    ) {

    }
}