package com.hoatv.template.management.callbacks;

import org.springframework.data.elasticsearch.core.event.BeforeConvertCallback;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;

import java.util.Objects;
import java.util.UUID;

public class UUIDKeyBeforeConvertCallback<T extends UUIDPersistable> implements BeforeConvertCallback<T> {

    @Override
    public T onBeforeConvert(T entity, IndexCoordinates index) {
        if (Objects.isNull(entity.getId())) {
            entity.setId(UUID.randomUUID());
        }
        return entity;
    }
}
