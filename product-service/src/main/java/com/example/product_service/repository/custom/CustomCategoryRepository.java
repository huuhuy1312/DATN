package com.example.product_service.repository.custom;


import com.example.product_service.dto.response.CategoryResponse;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomCategoryRepository {
    List<CategoryResponse> findByName(@Param("name") String name);
}
