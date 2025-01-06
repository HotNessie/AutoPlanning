package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.keyword.PreconditionKeyword;
import com.preplan.autoplan.domain.keyword.Transport;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PreconditionKeywordDto {
    private Long id;
    private LocalDateTime departureDate;
    private int arriveTime;
    private int departureTime;
    private Transport transport;

    @Builder
    public PreconditionKeywordDto(Long id,
                                  LocalDateTime departureDate,
                                  int arriveTime, int departureTime,
                                  Transport transport) {
        this.id = id;
        this.departureDate = departureDate;
        this.arriveTime = arriveTime;
        this.departureTime = departureTime;
        this.transport = transport;
    }

    public static PreconditionKeywordDto from(PreconditionKeyword preconditionKeyword) {
        return PreconditionKeywordDto.builder()
                .id(preconditionKeyword.getId())
                .departureDate(preconditionKeyword.getDepartureDate())
                .arriveTime(preconditionKeyword.getArriveTime())
                .departureTime(preconditionKeyword.getDepartureTime())
                .transport(preconditionKeyword.getTransport())
                .build();
    }
}