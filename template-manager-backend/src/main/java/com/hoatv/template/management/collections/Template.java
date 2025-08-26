package com.hoatv.template.management.collections;

import com.hoatv.fwk.common.ultilities.DateTimeUtils;
import com.hoatv.template.management.dtos.TemplateDTO;
import lombok.*;
import lombok.experimental.FieldNameConstants;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Document(collection = "template-collection")
public class Template {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String templateName;

    private String templateText;

    private String dataTemplateJSON;

    private long createdAt;

    private String createdBy;

    private long updatedAt;

    private String updatedBy;

    public TemplateDTO toTemplateDTO() {
        return TemplateDTO.builder()
                .uuid(this.id)
                .templateName(this.templateName)
                .templateText(this.templateText)
                .dataTemplateJSON(this.dataTemplateJSON)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    public static Template fromTemplateDTO(TemplateDTO templateDTO) {
        long currentTime = DateTimeUtils.getCurrentEpochTimeInMillisecond();
        return Template.builder()
                .templateName(templateDTO.getTemplateName())
                .templateText(templateDTO.getTemplateText())
                .dataTemplateJSON(templateDTO.getDataTemplateJSON())
                .createdAt(currentTime)
                .updatedAt(currentTime)
                .createdBy("system")
                .updatedBy("system")
                .build();
    }
}
