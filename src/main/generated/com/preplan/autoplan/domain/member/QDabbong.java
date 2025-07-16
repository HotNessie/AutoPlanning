package com.preplan.autoplan.domain.member;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDabbong is a Querydsl query type for Dabbong
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDabbong extends EntityPathBase<Dabbong> {

    private static final long serialVersionUID = 420276634L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDabbong dabbong = new QDabbong("dabbong");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QMember member;

    public final com.preplan.autoplan.domain.planPlace.QPlan plan;

    public QDabbong(String variable) {
        this(Dabbong.class, forVariable(variable), INITS);
    }

    public QDabbong(Path<? extends Dabbong> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDabbong(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDabbong(PathMetadata metadata, PathInits inits) {
        this(Dabbong.class, metadata, inits);
    }

    public QDabbong(Class<? extends Dabbong> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member")) : null;
        this.plan = inits.isInitialized("plan") ? new com.preplan.autoplan.domain.planPlace.QPlan(forProperty("plan"), inits.get("plan")) : null;
    }

}

