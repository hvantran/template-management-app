package com.hoatv.template.management.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TemplateDTO {

    private String uuid;

    private String templateName;

    private String templateText;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
