package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.TemplateReport;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TemplateReportRepository extends MongoRepository<TemplateReport, String> {
    
    List<TemplateReport> findByTemplateUUID(String templateId);
}
