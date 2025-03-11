package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeOfProductInRateResponse {
    public Long id;
    public String label1;
    public String label2;
}
