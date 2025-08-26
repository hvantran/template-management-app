package com.hoatv.template.management.repositories;

import com.hoatv.template.management.collections.TemplateData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TemplateDataRepository extends MongoRepository<TemplateData, String> {

    List<TemplateData> findByTemplateUUID(String templateId);
}
