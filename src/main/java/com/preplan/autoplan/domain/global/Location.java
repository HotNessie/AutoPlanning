package com.preplan.autoplan.domain.global;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class Location {

    private int id;

    private String name;

//    시,군,구  시,구,  읍,면,동


}
