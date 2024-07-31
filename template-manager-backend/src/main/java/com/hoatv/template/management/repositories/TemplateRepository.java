package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.Template;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;


public interface TemplateRepository extends ElasticsearchRepository<Template, UUID> {

    List<Template> findTemplateByTemplateName(String templateName);

    List<Template> findByTemplateNameContainingIgnoreCase(String templateName);
}
