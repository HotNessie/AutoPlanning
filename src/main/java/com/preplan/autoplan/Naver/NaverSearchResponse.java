package com.preplan.autoplan.Naver;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NaverSearchResponse {

    //    몰라시발/DTO임
    private String lastBuildDate;
    private Integer total;
    private Integer start;
    private Integer display;
    private NaverSearchItem[] items;
}
