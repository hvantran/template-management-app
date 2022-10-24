package com.hoatv.template.management.services;

import com.hoatv.fwk.common.exceptions.AppException;
import com.hoatv.template.management.exceptions.TemplateEngineException;

import java.util.Map;

public interface GenericTemplateEngine {

    String process(String templateName, String template, Map<String, Object> data);
}
