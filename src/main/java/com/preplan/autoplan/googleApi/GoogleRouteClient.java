package com.preplan.autoplan.googleApi;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.service.annotation.HttpExchange;

import org.springframework.web.service.annotation.PostExchange;

@Component
@HttpExchange(contentType = "application/json")
public interface GoogleRouteClient {

    @PostExchange("directions/v2:computeRoutes")
        //얘네는 바디값으로 받아서 아래 바꿔야댐
    ComputeRoutesResponse getRoute(
        @RequestHeader("X-Goog-FieldMask") String fieldMask,
        @RequestBody ComputeRoutesRequest request
    );
}

//    @GetExchange("/place/nearbysearch/json")
//    ComputeRoutesRequest getNearbyPlaces(
//        @RequestParam("location") String location,
//        @RequestParam("radius") int radius,
//        @RequestParam("type") String type,
//        @RequestParam("key") String key
//    );