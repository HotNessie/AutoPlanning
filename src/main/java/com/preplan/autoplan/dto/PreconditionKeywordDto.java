package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.keyword.PreconditionKeyword;
import com.preplan.autoplan.domain.keyword.Transport;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PreconditionKeywordDto {
    private Long id;
    private int arriveTime;
    private int departureTime;
    private Transport transport;

    @Builder
    public PreconditionKeywordDto(Long id,
                                  int arriveTime, int departureTime,
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