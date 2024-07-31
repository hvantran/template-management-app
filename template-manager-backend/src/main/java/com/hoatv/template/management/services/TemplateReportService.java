package com.hoatv.template.management.services;

import com.fasterxml.jackson.databind.json.JsonMapper;
import com.hoatv.fwk.common.services.CheckedSupplier;
import com.hoatv.fwk.common.ultilities.DateTimeUtils;
import com.hoatv.monitor.mgmt.LoggingMonitor;
import com.hoatv.template.management.collections.Template;
import com.hoatv.template.management.collections.TemplateData;
import com.hoatv.template.management.collections.TemplateReport;
import com.hoatv.template.management.dtos.TemplateReportDTO;
import com.hoatv.template.management.collections.TemplateReportStatus;
import com.hoatv.template.management.repositories.TemplateDataRepository;
import com.hoatv.template.management.repositories.TemplateReportRepository;
import org.springframework.data.elasticsearch.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class TemplateReportService {

    private final TemplateReportRepository templateReportRepository;
    private final TemplateDataRepository templateDataRepository;

    private final JsonMapper jsonMapper;

    public TemplateReportService(TemplateReportRepository templateReportRepository, TemplateDataRepository templateDataRepository) {
        this.templateReportRepository = templateReportRepository;
        this.templateDataRepository = templateDataRepository;
        this.jsonMapper = new JsonMapper();
    }

    @LoggingMonitor
    public TemplateReportDTO downloadReportByReportId(String reportId) {
        Optional<TemplateReport> templateReportOptional = templateReportRepository.findById(UUID.fromString(reportId));
        TemplateReport templateReport = templateReportOptional.orElseThrow(() -> new ResourceNotFoundException("Cannot find the report: " + reportId));
        return templateReport.toTemplateReportDTO();
    }

    @LoggingMonitor
    public TemplateReportDTO getTemplateReportStatus(String reportId) {
        Optional<TemplateReport> templateReportOptional = templateReportRepository.findById(UUID.fromString(reportId));
        TemplateReport templateReport = templateReportOptional.orElseThrow(() -> new ResourceNotFoundException("Cannot find the report: " + reportId));
        return TemplateReportDTO.builder().status(templateReport.getStatus().toString()).build();
    }

    @LoggingMonitor
    public TemplateReportDTO processTemplate(Template template, String engine, String dataTemplateJson) {
        CheckedSupplier<Map<String, Object>> supplier = () -> jsonMapper.readValue(dataTemplateJson, Map.class);
        Map<String, Object> objectData = supplier.get();
        TemplateEngineEnum templateEngineEnum = TemplateEngineEnum.getTemplateEngineFromName(engine);

        TemplateData templateData = TemplateData.builder()
                .dataTemplateJSON(dataTemplateJson)
                .templateEngine(templateEngineEnum)
                .templateUUID(template.getId())
                .build();
        templateDataRepository.save(templateData);

        TemplateReport templateReport = TemplateReport.builder()
                .templateUUID(template.getId())
                .status(TemplateReportStatus.IN_PROGRESS)
                .build();
        templateReportRepository.save(templateReport);

        String data = templateEngineEnum.process(template.getTemplateName(), template.getTemplateText(), objectData);
        templateReport.setOutputReportText(data);
        templateReport.setEndedAt(DateTimeUtils.getCurrentEpochTimeInMillisecond());
        templateReport.setStatus(TemplateReportStatus.COMPLETED);
        templateReportRepository.save(templateReport);
        return templateReport.toTemplateReportDTO();
    }

    public Page<TemplateReportDTO> getTemplateReportDetails(PageRequest pageRequest) {
        Page<TemplateReport> templateReportDetails = templateReportRepository.findAll(pageRequest);
        return templateReportDetails.map(TemplateReport::toTemplateReportDTO);
    }

    public void deleteReportByTemplate(UUID templateId) {
        List<TemplateReport> templateReports = templateReportRepository.findByTemplateUUID(templateId);
        templateReportRepository.deleteAll(templateReports);
        List<TemplateData> templateDataList = templateDataRepository.findByTemplateUUID(templateId);
        templateDataRepository.deleteAll(templateDataList);

    }
}
