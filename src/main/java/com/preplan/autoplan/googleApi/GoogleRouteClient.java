package com.preplan.autoplan.googleApi;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import org.springframework.web.service.annotation.PostExchange;

@Component
@HttpExchange
//@HttpExchange(url = "https://openapi.naver.com/v1/search")
public interface GoogleRouteClient {

    //    @GetExchange("place/details/json")
    @PostExchange("directions/v2:computeRoutes")
    //얘네는 바디값으로 받아서 아래 바꿔야댐
    PlaceDetails getRoute(
        @RequestBody String origin,       //이거 확인 한번 하자
        @RequestBody String destination,
        @RequestBody String travelMode,
        @RequestBody String language
    );

//    @GetExchange("/place/nearbysearch/json")
//    NearbySearchResponse getNearbyPlaces(
//        @RequestParam("location") String location,
//        @RequestParam("radius") int radius,
//        @RequestParam("type") String type,
//        @RequestParam("key") String key
//    );
}