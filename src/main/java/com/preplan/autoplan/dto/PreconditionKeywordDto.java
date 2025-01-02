package com.preplan.autoplan.dto;

import com.preplan.autoplan.domain.keyword.Transport;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PreconditionKeywordDto {
    private Long id;
    private LocalDateTime departureDate;
    private int arriveTime;
    private int departureTime;
    private Transport transport;
}