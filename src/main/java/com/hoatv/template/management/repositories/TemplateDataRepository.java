package com.hoatv.template.management.repositories;

import com.hoatv.template.management.entities.TemplateData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TemplateDataRepository extends JpaRepository<TemplateData, UUID> {
}
