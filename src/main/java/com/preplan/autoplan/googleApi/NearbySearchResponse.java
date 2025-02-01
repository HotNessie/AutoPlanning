package com.preplan.autoplan.googleApi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NearbySearchResponse {
    
    private String location;
    private int radius;
    private String type;
    private String key;
}
