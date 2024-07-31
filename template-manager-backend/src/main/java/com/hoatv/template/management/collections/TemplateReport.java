package com.hoatv.template.management.collections;

import com.hoatv.template.management.callbacks.UUIDPersistable;
import com.hoatv.template.management.dtos.TemplateReportDTO;
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
@Document(indexName = "template-report-#{T(java.time.LocalDate).now().toString()}")
public class TemplateReport implements Persistable<UUID>, UUIDPersistable<UUID> {


    @Id
    private UUID id;

    @Field(type = FieldType.Keyword)
    private TemplateReportStatus status;

    @Field(type = FieldType.Text)
    private String outputReportText;

    @Field(type = FieldType.Long)
    private Long startedAt;

    @Field(type = FieldType.Long)
    private Long endedAt;

    @Transient
    private String elapsedTime;

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

    public TemplateReportDTO toTemplateReportDTO() {
        return TemplateReportDTO.builder()
                .uuid(this.id.toString())
                .elapsedTime(this.elapsedTime)
                .status(this.status.toString())
                .endedAt(this.endedAt)
                .outputReportText(this.outputReportText)
                .startedAt(this.startedAt)
                .build();
    }
}
