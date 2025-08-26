package com.hoatv.template.management.collections;

import com.hoatv.template.management.services.TemplateEngineEnum;
import lombok.*;
import lombok.experimental.FieldNameConstants;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Document(collection = "template-data-collection")
public class TemplateData {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String dataTemplateJSON;

    private TemplateEngineEnum templateEngine;

    private String templateUUID;

    private long createdAt;

    private String createdBy;

    private long updatedAt;

    private String updatedBy;
}
