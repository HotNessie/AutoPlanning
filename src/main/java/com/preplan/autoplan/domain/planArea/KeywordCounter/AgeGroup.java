package com.preplan.autoplan.domain.planArea.KeywordCounter;


//TODO: 이거 다시
public enum AgeGroup {
    BABY(2020),
    KIDS(2010),
    TWENTIES(2000),
    THIRTIES(1990),
    FORTIES(1980),
    FIFTIES(1970),
    OLD_MAN(1960);

    private final int startYear;

    AgeGroup(int startYear) {
        this.startYear = startYear;
    }

    public int getStartYear() {
        return startYear;
    }

//    public static AgeGroup fromBirthYear(int birthYear) {
//        for (AgeGroup group : values()) {
//            if (birthYear >= group.getStartYear()) {
//                return group;
//            }
//        }
//        return OLD_MAN;
//    }
}
