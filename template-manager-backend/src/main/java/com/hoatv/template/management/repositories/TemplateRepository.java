package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.Template;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface TemplateRepository extends MongoRepository<Template, String> {

    List<Template> findTemplateByTemplateName(String templateName);

    List<Template> findByTemplateNameContainingIgnoreCase(String templateName, Sort sort);
}
