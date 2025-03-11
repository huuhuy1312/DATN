package com.example.product_service.repository.custom;

import com.example.product_service.dto.request.FilterProductRequest;
import com.example.product_service.dto.response.ProductDetailsResponse;
import com.example.product_service.entity.Product;

import java.util.List;

public interface CustomProductRepository {
    List<Long> findByCondition(FilterProductRequest filterProductRequest);
}
