package com.preplan.autoplan.domain.keyword.SelectKeyword;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Mood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mood_id")
    private Long id;

    //    @ElementCollection
//    @CollectionTable(name = "mood_fields", joinColumns = @JoinColumn(name = "mood_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "field")
    private MoodField moodField;

    @Builder
    public Mood(MoodField moodField) {
        this.moodField = moodField;
    }

}
