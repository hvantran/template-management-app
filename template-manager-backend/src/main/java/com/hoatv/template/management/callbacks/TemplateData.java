package com.hoatv.template.management.callbacks;

import com.hoatv.template.management.services.TemplateEngineEnum;
import lombok.*;
import lombok.experimental.FieldNameConstants;
import org.springframework.data.annotation.*;
import org.springframework.data.domain.Persistable;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Document(indexName = "template-data-#{T(java.time.LocalDate).now().toString()}")
public class TemplateData implements Persistable<UUID> {

    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String dataTemplateJSON;

    @Field(type = FieldType.Keyword)
    private TemplateEngineEnum templateEngine;

    @Field(type = FieldType.Keyword)
    private UUID templateUUID;

    @CreatedDate
    @Field(type = FieldType.Date, format = DateFormat.basic_date_time)
    private Instant createdDate;

    @CreatedBy
    private String createdBy;

    @Field(type = FieldType.Date, format = DateFormat.basic_date_time)
    @LastModifiedDate
    private Instant lastModifiedDate;

    @LastModifiedBy
    private String lastModifiedBy;

    @Override
    public boolean isNew() {
        return id == null || (createdDate == null && createdBy == null);
    }
}
