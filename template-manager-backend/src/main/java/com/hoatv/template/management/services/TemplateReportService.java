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
import com.hoatv.fwk.common.exceptions.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        Optional<TemplateReport> templateReportOptional = templateReportRepository.findById(reportId);
        TemplateReport templateReport = templateReportOptional.orElseThrow(() -> new EntityNotFoundException("Cannot find the report: " + reportId));
        return templateReport.toTemplateReportDTO();
    }

    @LoggingMonitor
    public TemplateReportDTO getTemplateReportStatus(String reportId) {
        Optional<TemplateReport> templateReportOptional = templateReportRepository.findById(reportId);
        TemplateReport templateReport = templateReportOptional.orElseThrow(() -> new EntityNotFoundException("Cannot find the report: " + reportId));
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
                .createdAt(DateTimeUtils.getCurrentEpochTimeInMillisecond())
                .updatedAt(DateTimeUtils.getCurrentEpochTimeInMillisecond())
                .createdBy("system")
                .updatedBy("system")
                .build();
        templateDataRepository.save(templateData);

        TemplateReport templateReport = TemplateReport.builder()
                .templateUUID(template.getId())
                .status(TemplateReportStatus.IN_PROGRESS)
                .startedAt(DateTimeUtils.getCurrentEpochTimeInMillisecond())
                .createdAt(DateTimeUtils.getCurrentEpochTimeInMillisecond())
                .updatedAt(DateTimeUtils.getCurrentEpochTimeInMillisecond())
                .createdBy("system")
                .updatedBy("system")
                .build();
        templateReportRepository.save(templateReport);

        String data = templateEngineEnum.process(template.getTemplateName(), template.getTemplateText(), objectData);
        templateReport.setOutputReportText(data);
        templateReport.setEndedAt(DateTimeUtils.getCurrentEpochTimeInMillisecond());
        templateReport.setStatus(TemplateReportStatus.COMPLETED);
        templateReport.setUpdatedAt(DateTimeUtils.getCurrentEpochTimeInMillisecond());
        templateReport.setUpdatedBy("system");
        templateReportRepository.save(templateReport);
        return templateReport.toTemplateReportDTO();
    }

    public Page<TemplateReportDTO> getTemplateReportDetails(PageRequest pageRequest) {
        Page<TemplateReport> templateReportDetails = templateReportRepository.findAll(pageRequest);
        return templateReportDetails.map(TemplateReport::toTemplateReportDTO);
    }

    public void deleteReportByTemplate(String templateId) {
        List<TemplateReport> templateReports = templateReportRepository.findByTemplateUUID(templateId);
        templateReportRepository.deleteAll(templateReports);
        List<TemplateData> templateDataList = templateDataRepository.findByTemplateUUID(templateId);
        templateDataRepository.deleteAll(templateDataList);

    }
}
