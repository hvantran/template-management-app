package com.hoatv.template.management.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hoatv.template.management.entities.DataTemplate;

import java.util.UUID;

@Repository
public interface DataTemplateRepository extends JpaRepository<DataTemplate, UUID> {
}
