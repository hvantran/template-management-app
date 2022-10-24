package com.hoatv.template.management.services;

import com.hoatv.fwk.common.ultilities.ObjectUtils;
import com.hoatv.monitor.mgmt.LoggingMonitor;
import com.hoatv.template.management.dtos.DataTemplateDTO;
import com.hoatv.template.management.dtos.TemplateDTO;
import com.hoatv.template.management.dtos.TemplateReportDTO;
import com.hoatv.template.management.entities.Template;
import com.hoatv.template.management.repositories.TemplateRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final TemplateReportService templateReportService;

    public TemplateService(TemplateRepository templateRepository, TemplateReportService templateReportService) {
        this.templateRepository = templateRepository;
        this.templateReportService = templateReportService;
    }

    @LoggingMonitor
    public TemplateReportDTO processTemplate(String templateName, String engine, String dataTemplateJson) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateName);
        ObjectUtils.checkThenThrow(templates.size() == 0, () -> new EntityNotFoundException("Cannot find template with name: " + templateName));
        ObjectUtils.checkThenThrow(templates.size() > 1, "Cannot process template due to more than one template found");
        Template templateDTO = templates.get(0);
        return templateReportService.processTemplate(templateDTO, engine, dataTemplateJson);
    }

    @LoggingMonitor
    public void createTemplate(TemplateDTO templateDTO) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateDTO.getTemplateName());
        ObjectUtils.checkThenThrow(templates.size() > 0, "Template is already exist");

        Template template = Template.fromTemplateDTO(templateDTO);
        templateRepository.save(template);
    }

    @LoggingMonitor
    public List<TemplateDTO> getTemplatesByName(String templateName) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateName);
        ObjectUtils.checkThenThrow(templates.size() == 0, () -> new EntityNotFoundException("Cannot find template with name: " + templateName));
        return templates.stream().map(Template::toTemplateDTO).collect(Collectors.toList());
    }

    @LoggingMonitor
    public TemplateDTO updateTemplateByName(String templateName, String templateText) {
        List<Template> templates = templateRepository.findTemplateByTemplateName(templateName);
        ObjectUtils.checkThenThrow(templates.size() == 0, () -> new EntityNotFoundException("Cannot find template with name: " + templateName));
        ObjectUtils.checkThenThrow(templates.size() > 1, "Cannot process template due to more than one template found");
        Template template = templates.get(0);
        template.setTemplateText(templateText);
        templateRepository.save(template);
        return template.toTemplateDTO();
    }

    public List<TemplateDTO> getAllTemplates(PageRequest pageRequest) {
        Page<Template> templates = templateRepository.findAll(pageRequest);
        return templates.stream().map(Template::toTemplateDTO).collect(Collectors.toList());
    }
}
