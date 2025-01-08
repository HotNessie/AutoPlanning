package com.preplan.autoplan.domain.global;

import jakarta.persistence.*;
import lombok.Getter;

@Embeddable
@Getter
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private int id;

    private String name;

//    시,군,구  시,구,  읍,면,동


}
