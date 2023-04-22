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
public class TemplateReportDTO {


    private String uuid;

    private String status;

    private String outputReportText;

    private Long startedAt;

    private Long endedAt;

    private String elapsedTime;

}
