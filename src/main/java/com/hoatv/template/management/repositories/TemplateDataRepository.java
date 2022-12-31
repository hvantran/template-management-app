package com.hoatv.template.management.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hoatv.template.management.entities.TemplateData;

import java.util.UUID;

@Repository
public interface TemplateDataRepository extends JpaRepository<TemplateData, UUID> {
}
