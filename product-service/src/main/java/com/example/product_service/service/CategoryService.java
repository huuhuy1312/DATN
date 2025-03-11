package com.example.product_service.service;

import com.example.product_service.dto.request.FilterCategory;
import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> findParentCategories(){
        return categoryRepository.findParentCategories();
    }

    public List<CategoryResponse> findByIdParent(long idParent){
        return categoryRepository.findByIdParent(idParent);
    }

    public List<CategoryResponse> findByName(String name)
    {
        return categoryRepository.findByName(name);
    }
}
