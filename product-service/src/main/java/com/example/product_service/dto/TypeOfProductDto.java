package com.example.product_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class TypeOfProductDto {
    public Long id;
    public String label1;
    public String label2;
    public Integer quantity;
    public Long price;
    public Long cost;
    public Long originalPrice;
    public Long weight;
}
