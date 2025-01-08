package com.preplan.autoplan.domain.keyword;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PreconditionKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "precondition_keyword_id")
    private Long id;

    //TODO: location 어떻게 할건지 생각해봐야됨.
//    @Column(nullable = false)
//    private LocalDateTime departureDate;

    //이거 시발 int로 받는게 맞냐????
    @Column(nullable = false)
    private int arriveTime;

    @Column(nullable = false)
    private int departureTime;

    @Column(nullable = false)
    private Transport transport;

    @Builder
    public PreconditionKeyword(int arriveTime, int departureTime, Transport transport) {
        this.arriveTime = arriveTime;
        this.departureTime = departureTime;
        this.transport = transport;
    }
}
