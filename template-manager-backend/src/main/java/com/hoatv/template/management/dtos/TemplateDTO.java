package com.hoatv.template.management.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TemplateDTO {

    private String uuid;

    private String templateName;

    private String templateText;

    private String dataTemplateJSON;

    private Long createdAt;

    private Long updatedAt;

    // Additional getters for backwards compatibility
    public String getTemplateName() {
        return templateName;
    }

    public String getTemplateText() {
        return templateText;
    }

    public String getDataTemplateJSON() {
        return dataTemplateJSON;
    }
}
