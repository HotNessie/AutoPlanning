package com.preplan.autoplan.googleApi;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.service.annotation.HttpExchange;

import org.springframework.web.service.annotation.PostExchange;

@Component
@HttpExchange(contentType = "application/json")
public interface GoogleRouteClient { // REST API 호출용 interface

    @PostExchange("directions/v2:computeRoutes")
    ComputeRoutesResponse getRoute(
            @RequestHeader("X-Goog-FieldMask") String fieldMask,
            @RequestBody GoogleRoutesRequest apiRequest);
}
