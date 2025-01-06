package com.preplan.autoplan.domain.keyword.SelectKeyword;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Purpose {

    @Id
    @GeneratedValue
    @Column(name = "purpose_id")
    private Long id;

    //    @ElementCollection
//    @CollectionTable(name = "purpose_fields", joinColumns = @JoinColumn(name = "purpose_id"))
    @Column(name = "field")
    @Enumerated(EnumType.STRING)
    private PurposeField purposeField;

    @Builder
    public Purpose(PurposeField purposeField) {
        this.purposeField = purposeField;
    }
}
