package com.hoatv.template.management.controllers;

import com.hoatv.template.management.dtos.TemplateDTO;
import com.hoatv.template.management.dtos.TemplateReportDTO;
import com.hoatv.template.management.services.TemplateReportService;
import com.hoatv.template.management.services.TemplateService;
import jakarta.validation.Valid;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> createTemplate(@RequestBody TemplateDTO templateDTO) {
        templateService.createTemplate(templateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<?> getAllTemplates(@RequestParam int pageIndex, @RequestParam int pageSize) {
        Page<TemplateDTO> templateDTOList = templateService.getAllTemplates(PageRequest.of(pageIndex, pageSize));
        return ResponseEntity.ok(templateDTOList);
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TemplateDTO> updateTemplateByName(@RequestBody TemplateDTO templateDTO) {
        TemplateDTO templateDTOOutput  = templateService.updateTemplateByName(templateDTO.getTemplateName(), templateDTO.getTemplateText());
        return ResponseEntity.ok(templateDTOOutput);
    }

    @GetMapping(value = "/{template-name}")
    public ResponseEntity<List<TemplateDTO>> getTemplateByName(@NonNull @PathVariable("template-name") String templateName) {
        List<TemplateDTO> templateDTO  = templateService.getTemplatesByName(templateName);
        return ResponseEntity.ok(templateDTO);
    }

    @PostMapping(value = "/{template-name}/process-data", consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> processTemplate(@NonNull @PathVariable("template-name") String templateName, @RequestParam String engine, @Valid @RequestBody String dataTemplateJson) {
        TemplateReportDTO templateReportDTO = templateService.processTemplate(templateName, engine, dataTemplateJson);
        return ResponseEntity.ok(templateReportDTO.getOutputReportText());
    }

    @GetMapping(value = "/reports")
    public ResponseEntity<?> getTemplateReportDetails(@RequestParam int pageIndex, @RequestParam int pageSize) {
        Page<TemplateReportDTO> templateReportDetails = templateReportService.getTemplateReportDetails(PageRequest.of(pageIndex, pageSize));
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
