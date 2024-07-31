package com.hoatv.template.management.collections;

import com.hoatv.template.management.callbacks.UUIDPersistable;
import com.hoatv.template.management.dtos.TemplateDTO;
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
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Document(indexName = "template-#{T(java.time.LocalDate).now().toString()}")
public class Template implements Persistable<UUID>, UUIDPersistable<UUID> {

    @Id
    private UUID id;

    @Field(type = FieldType.Keyword)
    private String templateName;

    @Field(type = FieldType.Text)
    private String templateText;

    @Field(type = FieldType.Text)
    private String dataTemplateJSON;

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


    public TemplateDTO toTemplateDTO() {
        return TemplateDTO.builder()
                .uuid(this.id.toString())
                .templateName(this.templateName)
                .templateText(this.templateText)
                .dataTemplateJSON(this.dataTemplateJSON)
                .createdAt(this.createdDate.toEpochMilli())
                .updatedAt(this.lastModifiedDate.toEpochMilli())
                .build();
    }

    public static Template fromTemplateDTO(TemplateDTO templateDTO) {
        return Template.builder()
                .templateName(templateDTO.getTemplateName())
                .templateText(templateDTO.getTemplateText())
                .dataTemplateJSON(templateDTO.getDataTemplateJSON())
                .build();
    }
}
