package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.TemplateData;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.UUID;

public interface TemplateDataRepository  extends ElasticsearchRepository<TemplateData, UUID> {

    List<TemplateData> findByTemplateUUID(UUID templateId);
}
