package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.TemplateReport;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.UUID;

public interface TemplateReportRepository extends ElasticsearchRepository<TemplateReport, UUID> {


    List<TemplateReport> findByTemplateUUID(UUID templateId);
}

