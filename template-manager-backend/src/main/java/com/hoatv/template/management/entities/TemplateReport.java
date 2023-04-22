package com.hoatv.template.management.entities;

import com.hoatv.fwk.common.ultilities.DateTimeUtils;
import com.hoatv.template.management.dtos.TemplateReportDTO;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.time.DurationFormatUtils;
import org.hibernate.annotations.GenericGenerator;

import java.util.Objects;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TemplateReport {


    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID uuid;

    @Enumerated(EnumType.ORDINAL)
    @Column
    private TemplateReportStatus status;

    @Lob
    @Column
    private String outputReportText;

    @Column
    private Long startedAt;

    @Column
    private Long endedAt;

    @Transient
    private String elapsedTime;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "templateUUID", nullable = false)
    private Template templateUUID;

    @PrePersist
    public void prePersist() {
        startedAt = DateTimeUtils.getCurrentEpochTimeInMillisecond();
    }

    @PostLoad
    private void onLoad() {
        if (Objects.nonNull(this.endedAt)) {
            long elapsedTimeMillis = endedAt - startedAt;
            this.elapsedTime = DurationFormatUtils.formatDuration(elapsedTimeMillis, "HH:mm:ss.S");
        }
    }

    public TemplateReportDTO toTemplateReportDTO() {
        return TemplateReportDTO.builder()
                .uuid(this.uuid.toString())
                .elapsedTime(this.elapsedTime)
                .status(this.status.toString())
                .endedAt(this.endedAt)
                .outputReportText(this.outputReportText)
                .startedAt(startedAt)
                .build();
    }
}
