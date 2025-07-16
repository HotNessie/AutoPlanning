package com.preplan.autoplan.domain.planPlace;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPlan is a Querydsl query type for Plan
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPlan extends EntityPathBase<Plan> {

    private static final long serialVersionUID = 2091561244L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPlan plan = new QPlan("plan");

    public final NumberPath<Integer> bookmarks = createNumber("bookmarks", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> createdDate = createDateTime("createdDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> endTime = createDateTime("endTime", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isShared = createBoolean("isShared");

    public final DateTimePath<java.time.LocalDateTime> lastModifiedDate = createDateTime("lastModifiedDate", java.time.LocalDateTime.class);

    public final NumberPath<Integer> likes = createNumber("likes", Integer.class);

    public final com.preplan.autoplan.domain.member.QMember member;

    public final ListPath<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField>> moodKeywords = this.<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField>>createList("moodKeywords", com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField.class, EnumPath.class, PathInits.DIRECT2);

    public final ListPath<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField>> purposeKeywords = this.<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField, EnumPath<com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField>>createList("purposeKeywords", com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField.class, EnumPath.class, PathInits.DIRECT2);

    public final QRegion region;

    public final DateTimePath<java.time.LocalDateTime> startTime = createDateTime("startTime", java.time.LocalDateTime.class);

    public QPlan(String variable) {
        this(Plan.class, forVariable(variable), INITS);
    }

    public QPlan(Path<? extends Plan> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPlan(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPlan(PathMetadata metadata, PathInits inits) {
        this(Plan.class, metadata, inits);
    }

    public QPlan(Class<? extends Plan> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com.preplan.autoplan.domain.member.QMember(forProperty("member")) : null;
        this.region = inits.isInitialized("region") ? new QRegion(forProperty("region"), inits.get("region")) : null;
    }

}

