package com.hoatv.template.management.repositories;

import com.hoatv.template.management.entities.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TemplateRepository extends JpaRepository<Template, UUID> {

    List<Template> findTemplateByTemplateName(String templateName);
}
