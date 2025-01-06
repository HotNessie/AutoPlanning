package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.planArea.Area.Area;
import com.preplan.autoplan.domain.disable.KeywordCounter.KeywordCounter;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AreaResponseDto {

    private Long id;

    private String name;

    private Integer estimatedTimeRequired;

    private Integer ddabong;

    @Builder
    public AreaResponseDto(Long id, String name,
                           int estimatedTimeRequired,
                           int ddabong) {
        this.id = id;
        this.name = name;
        this.estimatedTimeRequired = estimatedTimeRequired;
        this.ddabong = ddabong;
    }

    public static AreaResponseDto from(Area area) {

        return AreaResponseDto.builder()
                .id(area.getId())
                .name(area.getName())
                .estimatedTimeRequired(area.getEstimatedTimeRequired())
                .ddabong(area.getDdabong())
                .build();
    }

}