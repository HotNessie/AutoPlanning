package com.preplan.autoplan.googleApi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceDetails {

    private String placeId;
    //    private Geometry geometry;
    private String name;
    private String vicinity;
    //    private OpeningHours openingHours;
//    private Atmosphere atmosphere;
    private String icon;
    private String[] types;
    private String[] photos;
    private String website;
    private String priceLevel;
    private String rating;
    private String formattedPhoneNumber;
    private String[] reviews;
    private String[] scope;
    private String language;
    private String[] openingHoursPeriod;

}
