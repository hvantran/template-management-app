package com.hoatv.template.management.exceptions;

public class TemplateEngineException extends Exception {

    public TemplateEngineException(String message) {
        super(message);
    }

    public TemplateEngineException(Throwable throwable) {
        super(throwable);
    }

    public TemplateEngineException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
