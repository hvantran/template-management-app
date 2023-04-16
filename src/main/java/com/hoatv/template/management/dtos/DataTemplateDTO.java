package com.hoatv.template.management.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataTemplateDTO {


    private UUID uuid;

    private String dataTemplateJSON;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String templateEngineName;


}
