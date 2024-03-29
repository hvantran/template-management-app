package com.hoatv.template.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration
@ComponentScan({"com.hoatv.springboot.common", "com.hoatv.template.management"})
public class TemplateManagementApplication {

    public static void main(String[] args) {

        SpringApplication.run(TemplateManagementApplication.class, args);
    }
}
