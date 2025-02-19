package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.keyword.PreconditionKeyword;
import com.preplan.autoplan.domain.keyword.Transport;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PreconditionKeywordDto {

    private Long id;
    private String arriveTime;
    private String departureTime;
    private Transport transport;

    @Builder
    public PreconditionKeywordDto(Long id,
        String arriveTime, String departureTime,
        Transport transport) {
        this.id = id;
        this.arriveTime = arriveTime;
        this.departureTime = departureTime;
        this.transport = transport;
    }

    public static PreconditionKeywordDto from(PreconditionKeyword preconditionKeyword) {
        return PreconditionKeywordDto.builder()
            .id(preconditionKeyword.getId())
            .arriveTime(preconditionKeyword.getArriveTime())
            .departureTime(preconditionKeyword.getDepartureTime())
            .transport(preconditionKeyword.getTransport())
            .build();
    }
}