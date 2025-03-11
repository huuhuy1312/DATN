package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SuggestProductResponse {
    public Long pid;//
    public String image;//
    public String name;//
    public Long priceMax;//
    public Long priceMin;//
    public Long soldQuantity;
    public Double rateStar;
    public Integer reducePercent;
    public Long countRates;
    public LocalDateTime createdAt;
    public Integer totalAmount;
}
