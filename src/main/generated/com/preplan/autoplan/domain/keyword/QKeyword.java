package com.preplan.autoplan.domain.keyword;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QKeyword is a Querydsl query type for Keyword
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QKeyword extends EntityPathBase<Keyword> {

    private static final long serialVersionUID = -919464479L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QKeyword keyword = new QKeyword("keyword");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final QKeyword representativeKeyword;

    public final ListPath<Keyword, QKeyword> synonyms = this.<Keyword, QKeyword>createList("synonyms", Keyword.class, QKeyword.class, PathInits.DIRECT2);

    public QKeyword(String variable) {
        this(Keyword.class, forVariable(variable), INITS);
    }

    public QKeyword(Path<? extends Keyword> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QKeyword(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QKeyword(PathMetadata metadata, PathInits inits) {
        this(Keyword.class, metadata, inits);
    }

    public QKeyword(Class<? extends Keyword> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.representativeKeyword = inits.isInitialized("representativeKeyword") ? new QKeyword(forProperty("representativeKeyword"), inits.get("representativeKeyword")) : null;
    }

}

