package com.example.product_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterProductRequest {
    public String productName;
    public Long priceMin;
    public Long priceMax;
    public Long rateStar;
    public String sortField;
    public String typeSort;
    public Long categoryId;
    public Long countRates;
    public Integer pageSize;
    public Integer page;
}