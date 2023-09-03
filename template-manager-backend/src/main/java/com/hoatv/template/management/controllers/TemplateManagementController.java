package com.hoatv.template.management.controllers;

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

@RestController
@RequestMapping(value = "/templates", produces = MediaType.APPLICATION_JSON_VALUE)
public class TemplateManagementController {

    private TemplateService templateService;

    private TemplateReportService templateReportService;

    public TemplateManagementController(TemplateService templateService, TemplateReportService templateReportService) {
        this.templateService = templateService;
        this.templateReportService = templateReportService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> createTemplate(@RequestBody TemplateDTO templateDTO) {
        templateService.createTemplate(templateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<Object> getAllTemplates(@RequestParam int pageIndex, @RequestParam int pageSize) {
        Sort defaultSorting = Sort.by(Sort.Order.desc("createdAt"));
        Page<TemplateDTO> templateDTOList =
                templateService.getAllTemplates(PageRequest.of(pageIndex, pageSize, defaultSorting));
        return ResponseEntity.ok(templateDTOList);
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object><TemplateDTO> updateTemplateByName(@RequestBody TemplateDTO templateDTO) {
        TemplateDTO templateDTOOutput  = templateService.updateTemplateByName(templateDTO);
        return ResponseEntity.ok(templateDTOOutput);
    }

    @GetMapping(value = "/{template-name}")
    public ResponseEntity<Object><List<TemplateDTO>> getTemplateByName(@NonNull @PathVariable("template-name") String templateName) {
        List<TemplateDTO> templateDTO  = templateService.getTemplatesByName(templateName);
        return ResponseEntity.ok(templateDTO);
    }

    @PostMapping(value = "/{template-name}/process-data", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<Object> processTemplate(@NonNull @PathVariable("template-name") String templateName,
                                                  @RequestParam String engine,
                                                  @Valid @RequestBody String dataTemplateJson) {
        TemplateReportDTO templateReportDTO = templateService.processTemplate(templateName, engine, dataTemplateJson);
        return ResponseEntity.ok(Map.of("reportId", templateReportDTO.getUuid()));
    }

    @GetMapping(value = "/reports")
    public ResponseEntity<Object> getTemplateReportDetails(@RequestParam int pageIndex, @RequestParam int pageSize) {
        Sort defaultSorting = Sort.by(Sort.Order.desc("startedAt"));
        Page<TemplateReportDTO> templateReportDetails =
                templateReportService.getTemplateReportDetails(PageRequest.of(pageIndex, pageSize, defaultSorting));
        return ResponseEntity.ok(templateReportDetails);
    }

    @GetMapping(value = "/status/{report-uuid}")
    public ResponseEntity<Object><TemplateReportDTO> getTemplateReportStatus(@PathVariable("report-uuid") String reportId) {
        TemplateReportDTO templateReportStatus = templateReportService.getTemplateReportStatus(reportId);
        return ResponseEntity.ok(templateReportStatus);
    }

    @GetMapping(value = "/download/{report-uuid}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<Object><String> downloadReportByReportId(@NonNull @PathVariable("report-uuid") String reportId) {
        TemplateReportDTO templateReportDTO = templateReportService.downloadReportByReportId(reportId);
        return ResponseEntity.ok(templateReportDTO.getOutputReportText());
    }
}
