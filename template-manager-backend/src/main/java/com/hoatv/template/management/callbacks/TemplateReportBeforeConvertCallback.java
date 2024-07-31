package com.hoatv.template.management.callbacks;

import com.hoatv.template.management.collections.TemplateReport;
import org.springframework.data.elasticsearch.core.event.BeforeConvertCallback;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.UUID;

@Component
public class TemplateReportBeforeConvertCallback implements BeforeConvertCallback<TemplateReport> {

    @Override
    public TemplateReport onBeforeConvert(TemplateReport entity, IndexCoordinates index) {
        if (Objects.isNull(entity.getId())) {
            entity.setId(UUID.randomUUID());
        }
        return entity;
    }
}
