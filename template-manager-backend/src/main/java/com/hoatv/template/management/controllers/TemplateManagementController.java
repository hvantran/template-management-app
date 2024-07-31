package com.hoatv.template.management.controllers;

import com.hoatv.template.management.collections.Template;
import com.hoatv.template.management.collections.TemplateReport;
import com.hoatv.template.management.dtos.TemplateDTO;
import com.hoatv.template.management.dtos.TemplateReportDTO;
import com.hoatv.template.management.services.TemplateReportService;
import com.hoatv.template.management.services.TemplateService;
import jakarta.validation.Valid;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(value = "/templates", produces = MediaType.APPLICATION_JSON_VALUE)
public class TemplateManagementController {

    private final TemplateService templateService;

    private final TemplateReportService templateReportService;

    public TemplateManagementController(
            TemplateService templateService,
            TemplateReportService templateReportService) {
        
        this.templateService = templateService;
        this.templateReportService = templateReportService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> createTemplate(@RequestBody TemplateDTO templateDTO) {
        templateService.createTemplate(templateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<Object> getAllTemplates(
            @RequestParam("pageIndex") int pageIndex,
            @RequestParam("pageSize") int pageSize) {
        Sort defaultSorting = Sort.by(Sort.Order.desc(Template.Fields.createdDate));
        Page<TemplateDTO> templateDTOList =
                templateService.getAllTemplates(PageRequest.of(pageIndex, pageSize, defaultSorting));
        return ResponseEntity.ok(templateDTOList);
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TemplateDTO> updateTemplateByName(@RequestBody TemplateDTO templateDTO) {
        TemplateDTO templateDTOOutput = templateService.updateTemplateByName(templateDTO);
        return ResponseEntity.ok(templateDTOOutput);
    }

    @DeleteMapping(value = "/{uuid}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteTemplate(@NonNull @PathVariable("uuid") UUID templateId) {
        templateService.deleteTemplate(templateId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{template-name}")
    public ResponseEntity<List<TemplateDTO>> getTemplateByName(
            @NonNull @PathVariable("template-name") String templateName) {

        List<TemplateDTO> templateDTO = templateService.getTemplatesByName(templateName);
        return ResponseEntity.ok(templateDTO);
    }

    @GetMapping(value = "/search")
    public ResponseEntity<List<TemplateDTO>> searchTemplate(
            @NonNull @RequestParam("name") String templateName) {
        List<TemplateDTO> templateDTO = templateService.searchTemplateByName(templateName);
        return ResponseEntity.ok(templateDTO);
    }

    @PostMapping(value = "/{template-name}/process-data", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<Object> processTemplate(
            @NonNull @PathVariable("template-name") String templateName,
            @RequestParam("engine") String engine,
            @Valid @RequestBody String dataTemplateJson) {
        TemplateReportDTO templateReportDTO = templateService.processTemplate(templateName, engine, dataTemplateJson);
        return ResponseEntity.ok(Map.of("reportId", templateReportDTO.getUuid()));
    }

    @GetMapping(value = "/reports")
    public ResponseEntity<Object> getTemplateReportDetails(
            @RequestParam("pageIndex") int pageIndex,
            @RequestParam("pageSize") int pageSize) {
        Sort defaultSorting = Sort.by(Sort.Order.desc(TemplateReport.Fields.startedAt));
        Page<TemplateReportDTO> templateReportDetails =
                templateReportService.getTemplateReportDetails(PageRequest.of(pageIndex, pageSize, defaultSorting));
        return ResponseEntity.ok(templateReportDetails);
    }

    @GetMapping(value = "/status/{report-uuid}")
    public ResponseEntity<TemplateReportDTO> getTemplateReportStatus(@PathVariable("report-uuid") String reportId) {
        TemplateReportDTO templateReportStatus = templateReportService.getTemplateReportStatus(reportId);
        return ResponseEntity.ok(templateReportStatus);
    }

    @GetMapping(value = "/download/{report-uuid}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> downloadReportByReportId(@NonNull @PathVariable("report-uuid") String reportId) {
        TemplateReportDTO templateReportDTO = templateReportService.downloadReportByReportId(reportId);
        return ResponseEntity.ok(templateReportDTO.getOutputReportText());
    }
}
