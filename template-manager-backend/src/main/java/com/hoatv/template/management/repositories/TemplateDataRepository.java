package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.TemplateData;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.UUID;

public interface TemplateDataRepository  extends ElasticsearchRepository<TemplateData, UUID> {

}
