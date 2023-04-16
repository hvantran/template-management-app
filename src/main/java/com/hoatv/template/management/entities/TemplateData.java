package com.hoatv.template.management.entities;

import com.hoatv.template.management.services.TemplateEngineEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TemplateData {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID uuid;

    @Lob
    @Column
    private String dataTemplateJSON;

    @Column
    @Enumerated(EnumType.ORDINAL)
    private TemplateEngineEnum templateEngine;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "templateUUID", nullable = false)
    private Template templateUUID;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
