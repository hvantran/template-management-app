package com.hoatv.template.management.callbacks;

import org.springframework.lang.Nullable;

public interface UUIDPersistable<I> {
    void setId(I id);

    I getId();
}
