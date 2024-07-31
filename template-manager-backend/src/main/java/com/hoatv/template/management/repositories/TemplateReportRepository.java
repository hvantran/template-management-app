package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.TemplateReport;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.UUID;

public interface TemplateReportRepository extends ElasticsearchRepository<TemplateReport, UUID> {

}

