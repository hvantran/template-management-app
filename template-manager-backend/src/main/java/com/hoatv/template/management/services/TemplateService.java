package com.hoatv.template.management.services;

import com.hoatv.fwk.common.ultilities.ObjectUtils;
import com.hoatv.monitor.mgmt.LoggingMonitor;
import com.hoatv.template.management.collections.Template;
import com.hoatv.template.management.dtos.TemplateDTO;
import com.hoatv.template.management.dtos.TemplateReportDTO;
import com.hoatv.template.management.repositories.TemplateRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class TemplateService {

    private static final String TEMPLATE_NOT_FOUND_PREFIX_MSG = "Cannot find template with name: ";
    private final TemplateRepository templateRepository;
    private final TemplateReportService templateReportService;

    public TemplateService(TemplateRepository templateRepository, TemplateReportService templateReportService) {
        this.templateRepository = templateRepository;
        this.templateReportService = templateReportService;
    }

    @LoggingMonitor
    public TemplateReportDTO processTemplate(String templateName, String engine, String dataTemplateJson) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateName);
        ObjectUtils.checkThenThrow(templates.isEmpty(),
                () -> new ResourceNotFoundException(TEMPLATE_NOT_FOUND_PREFIX_MSG + templateName));
        ObjectUtils.checkThenThrow(templates.size() > 1, "Cannot process template due to more than one template found");
        Template templateDTO = templates.getFirst();
        return templateReportService.processTemplate(templateDTO, engine, dataTemplateJson);
    }

    @LoggingMonitor
    public void createTemplate(TemplateDTO templateDTO) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateDTO.getTemplateName());
        ObjectUtils.checkThenThrow(!templates.isEmpty(), "Template is already exist");

        Template template = Template.fromTemplateDTO(templateDTO);
        templateRepository.save(template);
    }

    @LoggingMonitor
    public List<TemplateDTO> getTemplatesByName(String templateName) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateName);
        ObjectUtils.checkThenThrow(templates.isEmpty(),
                () -> new ResourceNotFoundException(TEMPLATE_NOT_FOUND_PREFIX_MSG + templateName));
        return templates.stream().map(Template::toTemplateDTO).toList();
    }

    @LoggingMonitor
    public TemplateDTO updateTemplateByName(TemplateDTO templateDTO) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateDTO.getTemplateName());
        ObjectUtils.checkThenThrow(templates.isEmpty(),
                () -> new ResourceNotFoundException(TEMPLATE_NOT_FOUND_PREFIX_MSG + templateDTO.getTemplateName()));
        ObjectUtils.checkThenThrow(templates.size() > 1,
                "Cannot process template due to more than one template found");
        Template template = templates.getFirst();
        template.setTemplateText(templateDTO.getTemplateText());
        template.setDataTemplateJSON(templateDTO.getDataTemplateJSON());
        templateRepository.save(template);
        return template.toTemplateDTO();
    }

    public Page<TemplateDTO> getAllTemplates(PageRequest pageRequest) {
        Page<Template> templates = templateRepository.findAll(pageRequest);
        return templates.map(Template::toTemplateDTO);
    }

    public void deleteTemplate(UUID templateId) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException(TEMPLATE_NOT_FOUND_PREFIX_MSG + templateId));
        templateRepository.delete(template);
        templateReportService.deleteReportByTemplate(templateId);
    }
}
