package com.example.product_service.repository;

import com.example.product_service.entity.ImageClassification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageClassificationRepository extends JpaRepository<ImageClassification,Long> {
}
