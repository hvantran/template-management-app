package com.hoatv.template.management.entities;

import com.hoatv.template.management.dtos.TemplateReportDTO;
import lombok.*;
import org.apache.commons.lang3.time.DurationFormatUtils;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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
    private LocalDateTime startedAt;

    @Column
    private LocalDateTime endedAt;

    @Transient
    private String elapsedTime;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "templateUUID", nullable = false)
    private Template templateUUID;

    @PrePersist
    public void prePersist() {
        startedAt = LocalDateTime.now();
    }

    @PostLoad
    private void onLoad() {
        if (Objects.nonNull(this.endedAt)) {
            long elapsedTimeMillis = ChronoUnit.MILLIS.between(startedAt, endedAt);
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
