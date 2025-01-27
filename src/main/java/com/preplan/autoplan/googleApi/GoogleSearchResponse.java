package com.preplan.autoplan.googleApi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleSearchResponse {

    private String lastBuildDate;
    private Integer total;
    private Integer start;
    private Integer display;
    private GoogleSearchItem[] items;
}
