package com.preplan.autoplan.domain.keyword;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PreconditionKeyword {

    @Id
    @GeneratedValue
    @Column(name = "precondition_keyword_id")
    private Long id;

    //TODO: location 어떻게 할건지 생각해봐야됨.
    @Column(nullable = false)
    private LocalDateTime departureDate;

    //이거 시발 int로 받는게 맞냐????
    @Column(nullable = false)
    private int arriveTime;

    @Column(nullable = false)
    private int departureTime;

    @Column(nullable = false)
    private Transport transport;

    @Builder
    public PreconditionKeyword(LocalDateTime departureDate, int arriveTime, int departureTime, Transport transport) {
        this.departureDate = departureDate;
        this.arriveTime = arriveTime;
        this.departureTime = departureTime;
        this.transport = transport;
    }
}
