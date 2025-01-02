package com.preplan.autoplan.domain.planArea.KeywordCounter;

import com.preplan.autoplan.domain.global.MyMath;
import com.preplan.autoplan.domain.planArea.Area;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
public abstract class KeywordCounter implements MyMath {
    @Id
    @GeneratedValue
    @Column(name = "keyword_counter_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    private int count;

    public final void increment() {
        this.count++;
    }

    public abstract boolean matchesField(Enum<?> field);

}
