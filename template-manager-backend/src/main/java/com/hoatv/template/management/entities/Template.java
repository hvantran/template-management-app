package com.hoatv.template.management.entities;

import com.hoatv.fwk.common.ultilities.DateTimeUtils;
import com.hoatv.template.management.dtos.TemplateDTO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Template {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID uuid;

    @Column(unique = true)
    private String templateName;

    @Lob
    @Column
    private String templateText;

    @Column
    private Long createdAt;

    @Column
    private Long updatedAt;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "templateUUID")
    private Set<TemplateReport> templateReports = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "templateUUID")
    private Set<TemplateData> templateData = new HashSet<>();

    @PrePersist
    public void prePersist() {
        createdAt = DateTimeUtils.getCurrentEpochTimeInMillisecond();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = DateTimeUtils.getCurrentEpochTimeInMillisecond();
    }

    public TemplateDTO toTemplateDTO() {
        return TemplateDTO.builder()
                .uuid(this.uuid.toString())
                .templateName(this.templateName)
                .templateText(this.templateText)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    public static Template fromTemplateDTO(TemplateDTO templateDTO) {
        return Template.builder()
                .templateName(templateDTO.getTemplateName())
                .templateText(templateDTO.getTemplateText())
                .build();
    }
}
