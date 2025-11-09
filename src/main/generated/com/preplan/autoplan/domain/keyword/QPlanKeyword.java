package com.preplan.autoplan.domain.keyword;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPlanKeyword is a Querydsl query type for PlanKeyword
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPlanKeyword extends EntityPathBase<PlanKeyword> {

    private static final long serialVersionUID = -1737017736L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPlanKeyword planKeyword = new QPlanKeyword("planKeyword");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QKeyword keyword;

    public final com.preplan.autoplan.domain.planPlace.QPlan plan;

    public QPlanKeyword(String variable) {
        this(PlanKeyword.class, forVariable(variable), INITS);
    }

    public QPlanKeyword(Path<? extends PlanKeyword> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPlanKeyword(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPlanKeyword(PathMetadata metadata, PathInits inits) {
        this(PlanKeyword.class, metadata, inits);
    }

    public QPlanKeyword(Class<? extends PlanKeyword> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.keyword = inits.isInitialized("keyword") ? new QKeyword(forProperty("keyword"), inits.get("keyword")) : null;
        this.plan = inits.isInitialized("plan") ? new com.preplan.autoplan.domain.planPlace.QPlan(forProperty("plan"), inits.get("plan")) : null;
    }

}

