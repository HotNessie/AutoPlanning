package com.preplan.autoplan.domain.planPlace;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPlaceKeyword is a Querydsl query type for PlaceKeyword
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPlaceKeyword extends EntityPathBase<PlaceKeyword> {

    private static final long serialVersionUID = -1971750443L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPlaceKeyword placeKeyword = new QPlaceKeyword("placeKeyword");

    public final NumberPath<Integer> count = createNumber("count", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField> moodKeyword = createEnum("moodKeyword", com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField.class);

    public final QPlace place;

    public final EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField> purposeKeyword = createEnum("purposeKeyword", com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField.class);

    public QPlaceKeyword(String variable) {
        this(PlaceKeyword.class, forVariable(variable), INITS);
    }

    public QPlaceKeyword(Path<? extends PlaceKeyword> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPlaceKeyword(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPlaceKeyword(PathMetadata metadata, PathInits inits) {
        this(PlaceKeyword.class, metadata, inits);
    }

    public QPlaceKeyword(Class<? extends PlaceKeyword> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.place = inits.isInitialized("place") ? new QPlace(forProperty("place"), inits.get("place")) : null;
    }

}

