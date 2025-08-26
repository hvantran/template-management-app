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
public class TemplateReportDTO {


    private String uuid;

    private String status;

    private String outputReportText;

    private Long startedAt;

    private Long endedAt;

    private String elapsedTime;

    // Additional getters for backwards compatibility
    public String getUuid() {
        return uuid;
    }

    public String getOutputReportText() {
        return outputReportText;
    }

}
