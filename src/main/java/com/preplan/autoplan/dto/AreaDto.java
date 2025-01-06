package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.global.Location;
import com.preplan.autoplan.domain.planArea.Area.Area;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AreaDto {

    private String name;

    private Location location;

    private Integer estimatedTimeRequired;

    private Integer opening;

    private Integer closing;

    private Integer ddabong;

    // 장소를 요청하면 api 날려서 현재 존재하는 장소인지 확인하는 작업이 필요
    //update AreaDto가 필요하겠네요?
    @Builder
    public AreaDto(String name,
                   Location location,
                   int estimatedTimeRequired,
                   int opening,
                   int closing,
                   int ddabong) {
        this.name = name;
        this.location = location;
        this.estimatedTimeRequired = estimatedTimeRequired;
        this.opening = opening;
        this.closing = closing;
        this.ddabong = ddabong;
    }

    public static AreaDto from(Area area) {
        return AreaDto.builder()
                .name(area.getName())
                .estimatedTimeRequired(area.getEstimatedTimeRequired())
                .opening(area.getOpening())
                .closing(area.getClosing())
                .ddabong(area.getDdabong())
                .build();
    }

}