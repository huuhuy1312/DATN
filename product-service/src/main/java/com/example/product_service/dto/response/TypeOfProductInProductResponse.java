package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeOfProductInProductResponse {
    public Long id;
    public String label1;
    public String label2;
    public Integer quantity;
    public Long originalPrice;
    public Long price;
    public Long cost;
    public Long weight;
    public Long soldQuantity;
    public Long revenue;
}
