package com.preplan.autoplan.domain.planPlace;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPlace is a Querydsl query type for Place
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPlace extends EntityPathBase<Place> {

    private static final long serialVersionUID = 413888884L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPlace place = new QPlace("place");

    public final StringPath address = createString("address");

    public final NumberPath<Long> averageStayTime = createNumber("averageStayTime", Long.class);

    public final QRegion cityRegion;

    public final QRegion countryRegion;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Double> latitude = createNumber("latitude", Double.class);

    public final NumberPath<Double> longitude = createNumber("longitude", Double.class);

    public final ListPath<PlaceKeyword, QPlaceKeyword> moodKeywords = this.<PlaceKeyword, QPlaceKeyword>createList("moodKeywords", PlaceKeyword.class, QPlaceKeyword.class, PathInits.DIRECT2);

    public final StringPath name = createString("name");

    public final StringPath placeId = createString("placeId");

    public final ListPath<PlaceKeyword, QPlaceKeyword> purposeKeywords = this.<PlaceKeyword, QPlaceKeyword>createList("purposeKeywords", PlaceKeyword.class, QPlaceKeyword.class, PathInits.DIRECT2);

    public final QRegion region;

    public final NumberPath<Integer> searchCount = createNumber("searchCount", Integer.class);

    public final ListPath<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField>> topMoodKeywords = this.<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField>>createList("topMoodKeywords", com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField.class, EnumPath.class, PathInits.DIRECT2);

    public final ListPath<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField>> topPurposeKeywords = this.<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField>>createList("topPurposeKeywords", com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField.class, EnumPath.class, PathInits.DIRECT2);

    public QPlace(String variable) {
        this(Place.class, forVariable(variable), INITS);
    }

    public QPlace(Path<? extends Place> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPlace(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPlace(PathMetadata metadata, PathInits inits) {
        this(Place.class, metadata, inits);
    }

    public QPlace(Class<? extends Place> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.cityRegion = inits.isInitialized("cityRegion") ? new QRegion(forProperty("cityRegion"), inits.get("cityRegion")) : null;
        this.countryRegion = inits.isInitialized("countryRegion") ? new QRegion(forProperty("countryRegion"), inits.get("countryRegion")) : null;
        this.region = inits.isInitialized("region") ? new QRegion(forProperty("region"), inits.get("region")) : null;
    }

}

