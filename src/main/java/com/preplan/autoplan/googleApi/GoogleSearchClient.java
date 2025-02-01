package com.preplan.autoplan.googleApi;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.Map;

@Component
@HttpExchange
//@HttpExchange(url = "https://openapi.naver.com/v1/search")
public interface GoogleSearchClient {

    @GetExchange("place/details/json")
    PlaceDetails getPlaceDetails(
        @RequestParam("placeId") String placeId,
        @RequestParam("key") String key
    );

    @GetExchange("/place/nearbysearch/json")
    NearbySearchResponse getNearbyPlaces(
        @RequestParam("location") String location,
        @RequestParam("radius") int radius,
        @RequestParam("type") String type,
        @RequestParam("key") String key
    );
}