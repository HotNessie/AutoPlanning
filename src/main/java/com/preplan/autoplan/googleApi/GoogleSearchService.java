package com.preplan.autoplan.googleApi;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleSearchService {

    private final GoogleRouteClient googleRouteClient;

//    public ComputeRoutesResponse getPlaceDetails(String placeId) {
//        return googleRouteClient.getPlaceDetails(placeId."key");
//    }

}