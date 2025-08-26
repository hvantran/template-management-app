package com.hoatv.template.management.collections;

import com.hoatv.template.management.dtos.TemplateReportDTO;
import lombok.*;
import lombok.experimental.FieldNameConstants;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Document(collection = "template-report-collection")
public class TemplateReport {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private TemplateReportStatus status;

    private String outputReportText;

    private Long startedAt;

    private Long endedAt;

    @Transient
    private String elapsedTime;

    private String templateUUID;

    private long createdAt;

    private String createdBy;

    private long updatedAt;

    private String updatedBy;

    public TemplateReportDTO toTemplateReportDTO() {
        return TemplateReportDTO.builder()
                .uuid(this.id)
                .elapsedTime(this.elapsedTime)
                .status(this.status.toString())
                .endedAt(this.endedAt)
                .outputReportText(this.outputReportText)
                .startedAt(this.startedAt)
                .build();
    }
}
