package com.preplan.autoplan.domain.planPlace;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRoute is a Querydsl query type for Route
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRoute extends EntityPathBase<Route> {

    private static final long serialVersionUID = 415845046L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRoute route = new QRoute("route");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath memo = createString("memo");

    public final QPlace place;

    public final QPlan plan;

    public final NumberPath<Integer> sequence = createNumber("sequence", Integer.class);

    public final NumberPath<Long> stayTime = createNumber("stayTime", Long.class);

    public final StringPath transportMode = createString("transportMode");

    public final NumberPath<Integer> travelDistance = createNumber("travelDistance", Integer.class);

    public final NumberPath<Integer> travelTime = createNumber("travelTime", Integer.class);

    public QRoute(String variable) {
        this(Route.class, forVariable(variable), INITS);
    }

    public QRoute(Path<? extends Route> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRoute(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRoute(PathMetadata metadata, PathInits inits) {
        this(Route.class, metadata, inits);
    }

    public QRoute(Class<? extends Route> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.place = inits.isInitialized("place") ? new QPlace(forProperty("place"), inits.get("place")) : null;
        this.plan = inits.isInitialized("plan") ? new QPlan(forProperty("plan"), inits.get("plan")) : null;
    }

}

