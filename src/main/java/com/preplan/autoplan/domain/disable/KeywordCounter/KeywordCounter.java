package com.preplan.autoplan.domain.disable.KeywordCounter;

import com.preplan.autoplan.domain.global.MyMath;
import com.preplan.autoplan.domain.planArea.Area.Area;
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

    //양방향
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    private int count;

    public final void increment() {
        this.count++;
    }

    public final void decrement() {
        if (count > 0) {
            this.count--;
        }
    }

    public abstract boolean matchesField(Enum<?> field);

    //연관관계 편의 메소드(with_Area) Many
    public void assignArea(Area area) {
        if (this.area != null) {
            this.area.getKeywordCounters().remove(this);
        }
        this.area = area;
        area.getKeywordCounters().add(this);
    }

    public void unassignArea() {
        if (this.area != null) {
            this.area.getKeywordCounters().remove(this);
            this.area = null;
        }
    }
}
